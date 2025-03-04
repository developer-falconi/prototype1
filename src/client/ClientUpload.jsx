import { Field, Formik } from "formik";
import { useState } from "react";
import { Button, Col, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import * as yup from 'yup';
import './client.scss';
import { CREATE_TICKET, UPLOAD_COMPROBANTE } from "../service/ticket.requests";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useRef } from "react";

export default function ClientUpload({
  showCreate,
  setShowCreate,
  totalClients,
  setTotalClients,
  totalPrice,
  setTotalPrice,
  prevent,
  event
}) {

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [clients, setClients] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const fileInputRef = useRef(null);

  const schema = yup.object().shape({
    fullName: yup.string().required('Nombre necesario').min(8, 'Esta bien??'),
    dni: yup.string().required('DNI necesario').min(8, 'Esta bien??'),
    sexo: yup.string().required('Sexo es requerido').oneOf(['HOMBRE', 'MUJER'], 'Seleccione una opción válida'),
    comprobante: yup.mixed().required('Comprobante necesario').test(
      'is-file-type',
      'Solo se permiten archivos de imagen o PDF',
      (value) => {
        if (!value) return false;
        return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
      }
    ),
    email: yup.string().email('Esta bien??').required('Email necesario'),
  });

  const handleAddClient = (values, setFieldValue) => {
    setClients((prevCli) => [...prevCli, { fullName: values.fullName, dni: values.dni, sexo: values.sexo }])
    setFieldValue('fullName', '')
    setFieldValue('dni', '')
    setFieldValue('sexo', '')
  }

  const handleDeleteClient = (indexDelete) => {
    setClients([...clients.filter((elem, index) => index !== indexDelete)])
  }

  const handleHide = () => {
    setShowCreate(false);
    setClients([]);
    setTotalPrice(prevent.price);
    setTotalClients(1);
    setFileUrl('');
  }

  const handleAddComprobante = (e, setFieldValue) => {
    if (e.target.files) {
      handleUploadComprobante(e.target.files[0], setFieldValue)
    }
  }

  const handleCreateTicket = async (ticketData, setFieldValue) => {
    setIsLoading(true);
    const dataParsed = {
      email: ticketData.email?.toLowerCase(),
      clients: clients,
      cloudinaryUrl: fileUrl,
      prevent: prevent._id,
      total: totalPrice
    }
    await CREATE_TICKET(dataParsed).then((res) => {
      setIsLoading(false);
      setShowCreate(false);
      setTotalClients(1);
      setClients([]);

      setFieldValue('comprobante', '');
      setFieldValue('email', '');
      setFileUrl('');
      if (res?._id) {
        return Swal.fire({
          title: 'Compra realizada con éxito',
          icon: 'success',
          text: 'Gracias por tu compra. Vamos a validar el pago y la entrada sera enviada a tu mail en los proximos dias. Corroborar en la carpeta SPAM'
        })
      } else {
        return Swal.fire({
          title: 'Ocurrió un error, intenta devuelta',
          icon: 'error'
        })
      }
    })
  }

  const handleUploadComprobante = async (file, setFieldValue) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('comprobante', file);
    // const fileEncoded = new URLSearchParams(formData).toString();

    await UPLOAD_COMPROBANTE(formData).then((res) => {
      if (res.success) {
        setFileUrl(res.fileUrl);
        setFieldValue('comprobante', file)
        setIsUploading(false);
      }
    })

  };

  return (
    <Modal
      show={showCreate}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-clients"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Carga los datos
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-buy-body'>
        <Formik
          validationSchema={schema}
          initialValues={{
            fullName: '',
            dni: '',
            comprobante: '',
            email: '',
            sexo: ''
          }}
          onSubmit={handleCreateTicket}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            errors,
            isValid,
          }) => (
            <Form noValidate onSubmit={handleSubmit} className='client-form'>
              <Form.Label>Datos de las {totalClients} entradas</Form.Label>
              <ListGroup>
                {clients.map((client, index) => {
                  return (
                    <ListGroup.Item key={index}>
                      <p>
                        {`${client.fullName} / ${client.dni} / ${client.sexo}`}
                      </p>
                      <FiTrash2 onClick={() => handleDeleteClient(index)} />
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>

              {
                clients.length !== totalClients && (
                  <>
                    <Form.Group as={Col} controlId="validationFormikFullName">
                      <Form.Label>Nombre completo</Form.Label>
                      <Field
                        type="text"
                        name="fullName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.fullName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikDni">
                      <Form.Label>DNI</Form.Label>
                      <Field
                        type="text"
                        name="dni"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.dni}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dni}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikSexo" className="mb-4">
                      <Form.Label>Sexo</Form.Label>
                      <Form.Control
                        className="w-25"
                        as="select"
                        name="sexo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.sexo}
                        isInvalid={!!errors.sexo}
                      >
                        <option value="">Seleccione</option>
                        <option value="HOMBRE">HOMBRE</option>
                        <option value="MUJER">MUJER</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.sexo}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikAddClient">
                      <Button
                        className="mt-0 mb-3"
                        disabled={!(values.fullName && values.dni && values.sexo) || !!errors.fullName || !!errors.dni || !!errors.sexo}
                        onClick={(e) => {
                          handleAddClient(values, setFieldValue)
                        }}>
                        Agregar
                      </Button>
                    </Form.Group>
                  </>
                )
              }
              {
                clients.length === totalClients && (
                  <>
                    <Form.Group as={Col} className="info-alias">
                      <Form.Label className="fs-5">Transferir ${totalPrice.toFixed(2)}</Form.Label>
                      <div className="alias">
                        <Form.Label>Hombres: {event.aliasHom}</Form.Label>
                        <Form.Label>Mujeres: {event.aliasMuj}</Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormikComprobante">
                      <Form.Label>Comprobante</Form.Label>
                      {
                        isUploading ? (
                          <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                        ) : (
                          <>
                            {
                              fileUrl ? (
                                <a href={fileUrl} target="_blank" rel="noreferrer">Comprobante</a>
                              ) : (
                                <input
                                  type="file"
                                  name="comprobante"
                                  accept=".jpg, .jpeg, .png, .pdf"
                                  ref={fileInputRef}
                                  onChange={(event) => {
                                    handleAddComprobante(event, setFieldValue)
                                    handleChange(event)
                                  }}
                                  onBlur={handleBlur}
                                />
                              )
                            }
                          </>
                        )
                      }
                      <Form.Control.Feedback type="invalid">
                        {errors.comprobante}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikEmail">
                      <Form.Label>Email</Form.Label>
                      <Field
                        type="text"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikButton">
                      {isLoading ? (
                        <Button disabled>
                          <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCreateTicket(values, setFieldValue)}
                          disabled={
                            clients.length !== totalClients ||
                            errors.email ||
                            errors.comprobante ||
                            isUploading
                          }
                        >
                          Enviar
                        </Button>
                      )}
                    </Form.Group>
                  </>
                )
              }
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal >
  );
}

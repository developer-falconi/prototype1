import { Field, Formik } from "formik";
import { useState } from "react";
import { Button, Col, Form, ListGroup, Modal, Row, Spinner } from "react-bootstrap";
import * as yup from 'yup';
import './client.scss';
import { CREATE_CLIENT } from "../service/ticket.requests";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useRef } from "react";
import { formatPrice } from "../helpers/constants";

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
  const [clients, setClients] = useState([]);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const fileInputRef = useRef(null);

  const schema = yup.object().shape({
    fullName: yup.string().required('Nombre necesario'),
    dni: yup.string().required('DNI necesario'),
    phone: yup.string().optional(),
    sexo: yup.string().required('Sexo es requerido').oneOf(['HOMBRE', 'MUJER', 'OTRO'], 'Seleccione una opción válida'),
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
    setClients((prevCli) => [...prevCli, {
      fullName: values.fullName,
      dni: values.dni,
      sexo: values.sexo,
      phone: values.phone
    }])
    setFieldValue('fullName', '')
    setFieldValue('dni', '')
    setFieldValue('sexo', '')
    setFieldValue('phone', '')
  }

  const handleDeleteClient = (indexDelete) => {
    setClients([...clients.filter((elem, index) => index !== indexDelete)])
  }

  const handleHide = () => {
    setShowCreate(false);
    setClients([]);
    setTotalPrice(prevent.price);
    setTotalClients(1);
    setComprobanteFile(null);
  }

  const handleAddComprobante = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobanteFile(file);
      setFieldValue('comprobante', file);
    }
  };

  const handleCreateTicket = async (ticketData, setFieldValue) => {
    setIsLoading(true);
    const clientsData = clients.map(client => ({
      fullName: client.fullName,
      docNumber: client.dni,
      gender: client.sexo,
      phone: client.phone,
      email: ticketData.email
    }));

    await CREATE_CLIENT(clientsData, event.id, comprobanteFile).then((res) => {
      setIsLoading(false);
      setShowCreate(false);
      setTotalClients(1);
      setClients([]);
      setFieldValue('comprobante', '');
      setFieldValue('email', '');
      setComprobanteFile(null);

      if (res?.success) {
        return Swal.fire({
          title: 'Compra realizada con éxito',
          icon: 'success',
          text: 'Gracias por tu compra. Vamos a validar el pago y la entrada sera enviada a tu mail en los proximos dias. Corroborar en la carpeta SPAM'
        })
      } else {
        const message = res?.message && res?.message?.length > 0 ? res?.message : 'Ocurrió un error, intenta devuelta';
        return Swal.fire({
          title: message,
          icon: 'error'
        })
      }
    })
  }

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
            sexo: '',
            phone: ''
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
                    <Row>
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
                    </Row>

                    <Row className="mb-4">
                      <Form.Group as={Col} controlId="validationFormikPhone">
                        <Form.Label>Telefono</Form.Label>
                        <Field
                          type="text"
                          name="phone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} controlId="validationFormikSexo">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Control
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
                          <option value="OTRO">OTRO</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.sexo}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Form.Group as={Row} controlId="validationFormikAddClient" className="p-2">
                      <Button
                        className="w-100"
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
                      <Form.Label className="fs-5">Transferir ${formatPrice(totalPrice)}</Form.Label>
                      <div className="alias">
                        <Form.Label>Alias: {event.alias}</Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormikComprobante">
                      <Form.Label>Comprobante</Form.Label>
                      <input
                        type="file"
                        name="comprobante"
                        accept=".jpg, .jpeg, .png, .pdf"
                        ref={fileInputRef}
                        onChange={(event) => handleAddComprobante(event, setFieldValue)}
                        onBlur={handleBlur}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.comprobante}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikEmail" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Field
                        type="text"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className='w-75'
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikButton">
                      <Button
                        className="w-100"
                        onClick={() => handleCreateTicket(values, setFieldValue)}
                        disabled={
                          clients.length !== totalClients ||
                          errors.email ||
                          errors.comprobante
                        }
                      >
                        {isLoading ? (
                          <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                        ) : (
                          'Enviar'
                        )}
                      </Button>
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

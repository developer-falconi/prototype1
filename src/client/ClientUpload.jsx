import { Field, Formik } from "formik";
import { useState } from "react";
import { Button, Col, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import * as yup from 'yup';
import './client.scss';
import { CREATE_TICKET } from "../service/ticket.requests";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

export default function ClientUpload({ showCreate, setShowCreate, totalClients, setTotalClients }) {

  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const schema = yup.object().shape({
    fullName: yup.string().required('Nombre necesario').min(8, 'Esta bien??'),
    dni: yup.string().required('DNI necesario').min(8, 'Esta bien??'),
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

  const handleAddClient = (values) => {
    setClients((prevCli) => [...prevCli, { fullName: values.fullName, dni: values.dni }])
  }

  const handleDeleteClient = (indexDelete) => {
    setClients([...clients.filter((elem, index) => index !== indexDelete)])
  }

  const onSubmitHandler = async (values, { setSubmitting }) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('clients', JSON.stringify(clients));
    formData.append('comprobante', values.comprobante);
    formData.append('email', values.email);

    await CREATE_TICKET(formData).then(() => {
      setIsLoading(false);
      setSubmitting(false);
      setShowCreate(false);
      setTotalClients(1);
      setClients([]);

      return Swal.fire({
        title: 'Compra realizada con exito',
        text: 'Vamos a validar el pago y una vez confirmado, te enviaremos al mail las entradas qr'
      })
    })
  };

  return (
    <Modal
      show={showCreate}
      onHide={() => setShowCreate(!showCreate)}
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
          }}
          onSubmit={onSubmitHandler}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            errors,
            isValid,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit} className='client-form'>
              <ListGroup>
                {clients.map((client, index) => (
                  <ListGroup.Item key={index}>
                    <p>
                      {`Cliente ${index + 1}: ${client.fullName}, DNI: ${client.dni}`}
                    </p>
                    <FiTrash2 onClick={() => handleDeleteClient(index)} />
                  </ListGroup.Item>
                ))}
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

                    <Form.Group as={Col} controlId="validationFormikAddClient">
                      <Button
                        className="mt-0 mb-3"
                        disabled={(!values.fullName && !values.dni) || clients.length === totalClients}
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
                    <Form.Group as={Col} controlId="validationFormikComprobante">
                      <Form.Label>Comprobante</Form.Label>
                      <input
                        type="file"
                        name="comprobante"
                        accept=".jpg, .jpeg, .png, .pdf"
                        onChange={(event) => {
                          setFieldValue('comprobante', event.currentTarget.files[0]);
                        }}
                        onBlur={handleBlur}
                      />
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
                        <Button type="submit" disabled={!isValid || clients.length !== totalClients}>
                          Enviar
                        </Button>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {clients.length !== totalClients && `Carga los nombre y dni de las ${totalClients} entradas`}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )
              }
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
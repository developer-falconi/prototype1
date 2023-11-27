import { Field, Formik } from "formik";
import { useState } from "react";
import { Button, Col, Form, Modal, Spinner } from "react-bootstrap";
import * as yup from 'yup';
import './client.scss';
import { CREATE_TICKET } from "../service/ticket.requests";

export default function ClientUpload({ showCreate, setShowCreate }) {
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmitHandler = async (values, { setSubmitting }) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('dni', values.dni);
    formData.append('comprobante', values.comprobante);
    formData.append('email', values.email);

    await CREATE_TICKET(formData).then(() => {
      setIsLoading(false);
      setSubmitting(false);
      setShowCreate(false)
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
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    Enviar
                  </Button>
                )}
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
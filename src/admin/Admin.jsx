import './admin.scss';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Field, Formik } from "formik";
import { Button, Col, Form, Modal } from "react-bootstrap";
import * as yup from 'yup';
import { firebaseAuth } from "../helpers/firebase";
import { useEffect, useState } from "react";
import { VERIFY_TOKEN } from "../service/ticket.requests";
import AdminTickets from './AdminTickets';

export default function Admin() {

  const [showLogin, setShowLogin] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const token = localStorage.getItem('token');

  const schema = yup.object().shape({
    password: yup.string().required('Nombre necesario').min(5, 'Esta bien??'),
    email: yup.string().email('Esta bien??').required('Email necesario'),
  });

  const handleLogin = async (values) => {
    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);

      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        setShowLogin(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const verifyToken = async () => {
      await VERIFY_TOKEN()
        .then((res) => {
          setValidToken(res);
        });
    }

    if (token) {
      verifyToken()
    }

  }, [token])

  return (
    <div className="content-page">
      {
        (validToken && token) ? (
          <div className="user-tickets">
            <AdminTickets />
          </div>
        ) : (
          <Modal
            show={showLogin}
            onHide={() => setShowLogin(!showLogin)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal-clients"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Solo admin
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modal-buy-body'>
              <Formik
                validationSchema={schema}
                initialValues={{
                  email: '',
                  password: ''
                }}
                onSubmit={(values) => {
                  handleLogin(values);
                }}
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
                  <Form noValidate onSubmit={handleSubmit} className='admin-form'>
                    <Form.Group as={Col} controlId="details">
                      <h1>FANTOM 9/12</h1>
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormikQuantity">
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

                    <Form.Group as={Col} controlId="validationFormikQuantity">
                      <Form.Label>Password</Form.Label>
                      <Field
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" disabled={!isValid}>
                      Iniciar sesion
                    </Button>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        )
      }
    </div >
  )
}
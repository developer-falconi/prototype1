import './admin.scss';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Field, Formik } from "formik";
import { Button, Col, Form, Spinner } from "react-bootstrap";
import * as yup from 'yup';
import { firebaseAuth } from "../helpers/firebase";
import { useEffect, useState } from "react";
import { VERIFY_TOKEN } from "../service/ticket.requests";
import { FaTicketAlt, FaUsers, FaRegCalendarAlt } from 'react-icons/fa';
import AdminPanel from './AdminPanel';

export default function Admin() {
  const [validToken, setValidToken] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const token = localStorage.getItem('token');

  const schema = yup.object().shape({
    email: yup.string().email('Por favor, ingrese un email válido').required('Email necesario'),
    password: yup.string().required('Contraseña necesaria').min(5, 'La contraseña debe tener al menos 5 caracteres'),
  });

  const handleLogin = async (values) => {
    setLoginLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        setValidToken(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      setVerifyingToken(true);
      const res = await VERIFY_TOKEN();
      setValidToken(!!res);
      setVerifyingToken(false);
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  if (verifyingToken) {
    return (
      <div className="loader-overlay">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Verificando token...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="content-page-admin">
      {(validToken && token) ? (
        <AdminPanel />
      ) : (
        <div className="login-container">
          <div className="icons-container">
            <FaTicketAlt className="icon" />
            <FaUsers className="icon" />
            <FaRegCalendarAlt className="icon" />
          </div>
          <div className="login-form-wrapper">
            <h1 className="admin-title">Envuelto Group</h1>
            <Formik
              validationSchema={schema}
              initialValues={{ email: '', password: '' }}
              onSubmit={handleLogin}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                isValid,
              }) => (
                <Form noValidate onSubmit={handleSubmit} className="admin-form">
                  <Form.Group as={Col} controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Field
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="form-control"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">{errors.email}</div>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Field
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className="form-control"
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                  </Form.Group>

                  <Button type="submit" disabled={!isValid || loginLoading} className="login-button">
                    {loginLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Iniciando...</span>
                      </>
                    ) : (
                      'Iniciar sesión'
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

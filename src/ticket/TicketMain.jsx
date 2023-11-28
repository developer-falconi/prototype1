import { Formik } from "formik";
import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import * as yup from 'yup';
import ClientUpload from "../client/ClientUpload";
import img from '../IMG-20231116-WA0011.jpg';
import img2 from '../IMG-20231116-WA0011 (1).jpg';
import './ticket.scss';

export default function TicketMain() {

  const [showCreate, setShowCreate] = useState(false);
  const [total, setTotal] = useState(6000);
  const [totalClients, setTotalClients] = useState(1);
  const price = 6000;

  const schema = yup.object().shape({
    quantity: yup.number().positive('Debe ser mayor a 0').required('Selecciona')
  });

  const handleClickNext = (setFieldValue) => {
    setShowCreate(true);
    setFieldValue('quantity', 1);
  };

  const generateOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  return (
    <div className="content-page">
      <Formik
        validationSchema={schema}
        initialValues={{
          quantity: 1
        }}
        onSubmit={(values, { setFieldValue }) => {
          handleClickNext(setFieldValue);
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
          <Form noValidate onSubmit={handleSubmit} className='ticket-form'>
            <Form.Group as={Col} controlId="details">
              <h1>FANTOM 9/12</h1>
            </Form.Group>

            <Form.Group as={Col} controlId="validationFormikQuantity">
              <Form.Label>Entradas</Form.Label>
              <Form.Select
                name="quantity"
                onChange={(e) => {
                  const selectedQuantity = parseInt(e.target.value, 10);
                  setFieldValue('quantity', selectedQuantity);
                  setTotal(selectedQuantity * price);
                  setTotalClients(selectedQuantity);
                }}
                onBlur={handleBlur}
                value={values.quantity}
              >
                {generateOptions()}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.quantity}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="validationTotal">
              <Form.Label>Total</Form.Label>
              <Form.Text>${total.toFixed(2)}</Form.Text>
            </Form.Group>

            <Button type="submit" disabled={!isValid}>
              Comprar
            </Button>
          </Form>
        )}
      </Formik>
      <img src={window.innerWidth > 521 ? img : img2} alt='img' className='flyer-img' />
      <ClientUpload
        showCreate={showCreate}
        setShowCreate={setShowCreate}
        totalClients={totalClients}
        setTotalClients={setTotalClients}
      />
    </div>
  );
}

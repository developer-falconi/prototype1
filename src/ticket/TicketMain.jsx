import { Formik } from "formik";
import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import * as yup from 'yup';
import ClientUpload from "../client/ClientUpload";
import img from '../IMG-20231116-WA0011.jpg';
import './ticket.scss';

export default function TicketMain() {

  const [showCreate, setShowCreate] = useState(false);
  const [total, setTotal] = useState(6000);
  const price = 6000;

  const schema = yup.object().shape({
    quantity: yup.number().positive('Debe ser mayor a 0').required('Selecciona')
  });

  const handleClickNext = (values, { setSubmitting }) => {
    console.log(values, total, price);
    setShowCreate(true)
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
        onSubmit={handleClickNext}
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
            <Form.Group as={Col} controlId="validationFormikQuantity">
              <Form.Label>Entradas</Form.Label>
              <Form.Select
                name="quantity"
                onChange={(e) => {
                  const selectedQuantity = parseInt(e.target.value, 10);
                  setFieldValue('quantity', selectedQuantity);
                  setTotal(selectedQuantity * price);
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
      <img src={img} alt='img' className='flyer-img' />
      <ClientUpload showCreate={showCreate} setShowCreate={setShowCreate} />
    </div>
  );
}

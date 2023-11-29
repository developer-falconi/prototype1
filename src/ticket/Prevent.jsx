import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { IoTicketSharp } from 'react-icons/io5';
import * as yup from 'yup';
import ClientUpload from '../client/ClientUpload';

export default function Prevent({ prevent }) {

  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(prevent.price);
  const [totalClients, setTotalClients] = useState(quantity);
  const [showCreate, setShowCreate] = useState(false);

  const schema = yup.object().shape({
    quantity: yup.number().positive('Debe ser mayor a 0').required('Selecciona'),
  });

  const handleClickNext = (setFieldValue) => {
    setShowCreate(true);
    setFieldValue('quantity', 1);
    setTotal(prevent.price * quantity);
  }

  const generateOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <>
      {/* {prevent.active && (
          <div class="sold-out-label">AGOTADO</div>
        )} */}
      <Formik
        validationSchema={schema}
        initialValues={{
          quantity: 1,
        }}
        onSubmit={(values, { setFieldValue }) => {
          handleClickNext(setFieldValue);
        }}
      >
        {({
          handleSubmit,
          handleBlur,
          setFieldValue,
          values,
          errors,
          isValid,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className="cardWrap">
            <Form.Group as={Col} className="card cardLeft" controlId={`validationFormikQuantity_${prevent._id}`}>
              <Form.Label className="title-prevent">{prevent.name}</Form.Label>
              <Form.Group className="select-tickets">
                <Form.Label>Seleccioná</Form.Label>
                <Form.Select
                  name="quantity"
                  onChange={(e) => {
                    const selectedQuantity = parseInt(e.target.value, 10);
                    setQuantity(selectedQuantity);
                    setTotal(selectedQuantity * prevent.price);
                    setTotalClients(selectedQuantity);
                    setFieldValue('quantity', selectedQuantity);
                  }}
                  onBlur={handleBlur}
                  value={values.quantity}
                  className="ticket-select"
                >
                  {generateOptions()}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Group>

            <Form.Group as={Col} className="card cardRight" controlId={`validationTotal_${prevent._id}`}>
              <IoTicketSharp className='ticket-icon' />
              <Form.Group className="number">
                <Form.Label className="ticket-label">Total</Form.Label>
                <Form.Text className="ticket-total">${total.toFixed(2)}</Form.Text>
              </Form.Group>
              <Form.Group className="button">
                <Button type="submit" disabled={!isValid} className="ticket-submit">
                  Comprar
                </Button>
              </Form.Group>
            </Form.Group>
          </Form>
        )}
      </Formik>
      <ClientUpload
        showCreate={showCreate}
        setShowCreate={setShowCreate}
        totalClients={totalClients}
        setTotalClients={setTotalClients}
        totalPrice={total}
        setTotalPrice={setTotal}
        prevent={prevent}
      />
    </>
  );
}

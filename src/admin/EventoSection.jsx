import { useEffect, useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { EDIT_EVENT_DATA, GET_EVENT_DATA } from "../service/ticket.requests";
import "./evento.scss";
import Swal from "sweetalert2";

export default function EventoSection() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await GET_EVENT_DATA();
        setEvent(response);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="evento-section">
        <div className="loader-container">
          <Spinner animation="border" variant="primary" />
          <span className="loader-text">Cargando evento...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="evento-section">
        <p className="evento-loading">Cargando evento...</p>
      </div>
    );
  }

  const initialValues = {
    name: event.name || "",
    number: event.number || "",
    date: event.date ? event.date.split("T")[0] : "",
    hours: event.hours || "",
    bar: event.bar || "",
    venue: event.venue || ""
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const eventEdited = await EDIT_EVENT_DATA(event._id, values);
      if (eventEdited) {
        setEvent(eventEdited);
        Swal.fire({
          title: "Evento actualizado correctamente",
          icon: "success",
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="evento-section">
      <h2 className="evento-title">Editar Evento</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, dirty }) => (
          <Form className="evento-form">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <Field type="text" name="name" id="name" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="number">Número:</label>
              <Field type="text" name="number" id="number" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="date">Fecha:</label>
              <Field type="date" name="date" id="date" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="hours">Horas:</label>
              <Field type="text" name="hours" id="hours" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="bar">Bar:</label>
              <Field type="text" name="bar" id="bar" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="venue">Venue:</label>
              <Field type="text" name="venue" id="venue" className="form-control" />
            </div>
            <div className="form-group submit-group">
              <Button
                type="submit"
                variant="primary"
                disabled={!dirty || isSubmitting || submitLoading}
              >
                {submitLoading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

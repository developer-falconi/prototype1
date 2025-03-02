import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import { GET_PREVENTS, EDIT_PREVENT_DATA } from "../service/ticket.requests";
import "./preventas.scss";

function PreventRow({ item, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState(item.prevent.active);
  const [activeLoading, setActiveLoading] = useState(false);

  const initialValues = {
    name: item.prevent.name,
    price: item.prevent.price,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updated = await EDIT_PREVENT_DATA(item.prevent._id, { ...values, active });
      onUpdate(item.prevent._id, updated);
      setEditing(false);
    } catch (error) {
      console.error("Error updating preventa:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleActiveChange = async (e) => {
    const newActive = e.target.checked;
    setActive(newActive);
    setActiveLoading(true);
    try {
      const updated = await EDIT_PREVENT_DATA(item.prevent._id, { active: newActive });
      onUpdate(item.prevent._id, updated);
    } catch (error) {
      console.error("Error updating active status:", error);
      setActive(!newActive);
    } finally {
      setActiveLoading(false);
    }
  };

  if (editing) {
    return (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, dirty, handleSubmit, resetForm }) => (
          <tr>
            <td>
              <Field name="name" className="form-control inline-input" />
            </td>
            <td>
              <Field name="price" type="number" className="form-control inline-input" />
            </td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={handleActiveChange}
                  disabled={activeLoading}
                />
                <span className="toggle-slider" />
              </label>
            </td>
            <td>{item.totalClients}</td>
            <td>
              <div className="edit-buttons">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !dirty}
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" /> Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    resetForm();
                  }}
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </td>
          </tr>
        )}
      </Formik>
    );
  } else {
    return (
      <tr>
        <td>{item.prevent.name}</td>
        <td>${Number(item.prevent.price).toFixed(2)}</td>
        <td>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={active}
              onChange={handleActiveChange}
              disabled={activeLoading}
            />
            <span className="toggle-slider" />
          </label>
        </td>
        <td>{item.totalClients}</td>
        <td>
          <Button
            variant="outline-primary"
            onClick={() => setEditing(true)}
            size="sm"
          >
            Editar
          </Button>
        </td>
      </tr>
    );
  }
}

export default function PreventasSection() {
  const [prevents, setPrevents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrevents = async () => {
    setLoading(true);
    try {
      const response = await GET_PREVENTS();
      setPrevents(response);
    } catch (error) {
      console.error("Error fetching prevents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrevents();
  }, []);

  const handleUpdate = (preventId, updatedData) => {
    setPrevents((prev) =>
      prev.map((item) =>
        item.prevent._id === preventId ? { ...item, prevent: updatedData } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="preventas-section">
        <div className="loader-container">
          <Spinner animation="border" variant="primary" />
          <span className="loader-text">Cargando preventas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="preventas-section">
      <h3 className="preventas-title">Preventas</h3>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Activa</th>
            <th>Clientes Totales</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prevents.map((item) => (
            <PreventRow
              key={item.prevent._id}
              item={item}
              onUpdate={handleUpdate}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

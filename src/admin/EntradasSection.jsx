import { useCallback, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { GET_TICKETS, CREATE_QR, GET_PREVENTS } from "../service/ticket.requests";
import EntradasTable from "./EntradasTable";
import "./entradas.scss";

export default function EntradasSection() {
  const [clients, setClients] = useState([]);
  const [prevents, setPrevents] = useState([]);
  const [activePrevent, setActivePrevent] = useState(null);

  // Separate loading states for prevents and tickets
  const [loadingPrevents, setLoadingPrevents] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Fetch all prevents
  const getPrevents = useCallback(async () => {
    setLoadingPrevents(true);
    try {
      const response = await GET_PREVENTS();
      setPrevents(response);
      if (response && response.length > 0) {
        setActivePrevent(response[0].prevent._id);
      }
    } catch (error) {
      console.error("Error fetching prevents:", error);
    } finally {
      setLoadingPrevents(false);
    }
  }, []);

  // Fetch tickets for the selected prevent
  const getClients = useCallback(async (preventId) => {
    if (!preventId) return;
    setLoadingTickets(true);
    try {
      const response = await GET_TICKETS(preventId);
      setClients(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // Generate a QR code for clients who don't have one
  const handleCreateQr = async (voucher) => {
    const createTicketsData = {
      clients: voucher.clients,
      email: voucher.email,
    };
    try {
      const clientsUpdated = await CREATE_QR(createTicketsData);
      const updatedVouchers = clients.map((prevCli) =>
        prevCli._id === voucher._id
          ? { ...prevCli, clients: clientsUpdated }
          : prevCli
      );
      setClients(updatedVouchers);
    } catch (error) {
      console.error("Error creating QR:", error);
    }
  };

  useEffect(() => {
    getPrevents();
  }, [getPrevents]);

  useEffect(() => {
    if (activePrevent) {
      getClients(activePrevent);
    }
  }, [activePrevent, getClients]);

  // Full-component loader while prevents are loading
  if (loadingPrevents) {
    return (
      <div className="loader-wrapper">
        <Spinner animation="border" variant="primary" />
        <span className="loader-text">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="entradas-full">
      <h2 className="entradas-title">Entradas</h2>
      <div className="entradas-controls">
        <label htmlFor="preventSelect" className="entradas-label">
          Preventa:
        </label>
        <Form.Control
          as="select"
          id="preventSelect"
          value={activePrevent || ""}
          onChange={(e) => setActivePrevent(e.target.value)}
          className="entradas-select"
        >
          {prevents.map((item) => (
            <option key={item.prevent._id} value={item.prevent._id}>
              {item.prevent.name}
            </option>
          ))}
        </Form.Control>
      </div>

      <div className="entradas-table-wrapper">
        {loadingTickets ? (
          <div className="table-loader">
            <Spinner animation="border" variant="primary" />
            <span className="loader-text">Cargando entradas...</span>
          </div>
        ) : (
          <EntradasTable clients={clients} onCreateQr={handleCreateQr} />
        )}
      </div>
    </div>
  );
}

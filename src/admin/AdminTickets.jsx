import { useCallback, useEffect, useState } from "react";
import { GET_TICKETS, CREATE_QR, GET_PREVENTS } from "../service/ticket.requests";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Card,
} from "react-bootstrap";
import "./admin.scss";
import EntradasSection from "./EntradasSection";

export default function AdminTickets() {
  const [clients, setClients] = useState([]);
  const [prevents, setPrevents] = useState([]);
  const [activePrevent, setActivePrevent] = useState(null);

  // Fetch all prevents
  const getPrevents = useCallback(async () => {
    try {
      const response = await GET_PREVENTS();
      setPrevents(response);

      // Default to the first prevent if it exists
      if (response && response.length > 0) {
        setActivePrevent(response[0].prevent._id);
      }
    } catch (error) {
      console.error("Error fetching prevents:", error);
    }
  }, []);

  // Fetch clients (tickets) for a given prevent ID
  const getClients = useCallback(async (preventId) => {
    try {
      if (!preventId) return;
      const response = await GET_TICKETS(preventId);
      setClients(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }, []);

  // Generate a QR code for clients who don't have one
  const handleCreateQr = async (voucher) => {
    const createTicketsData = {
      clients: voucher.clients,
      email: voucher.email,
    };
    const clientsUpdated = await CREATE_QR(createTicketsData);
    const updatedVouchers = clients.map((prevCli) =>
      prevCli._id === voucher._id
        ? { ...prevCli, clients: clientsUpdated }
        : prevCli
    );
    setClients(updatedVouchers);
  };

  // When component mounts, load prevents
  useEffect(() => {
    getPrevents();
  }, [getPrevents]);

  // Whenever activePrevent changes, fetch its tickets
  useEffect(() => {
    if (activePrevent) {
      getClients(activePrevent);
    }
  }, [activePrevent, getClients]);

  return (
    <div className="admin-container">
      {/* Minimal Navbar */}
      <Navbar expand="lg" variant="dark" className="admin-navbar">
        <Container>
          <Navbar.Brand>Envuelto Admin</Navbar.Brand>
          <Nav className="ms-auto">
            
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-4">
        {/* Card for Prevent Selection */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="fw-bold">Seleccionar Preventa</Card.Header>
          <Card.Body>
            <Form.Control
              as="select"
              value={activePrevent || ""}
              onChange={(e) => setActivePrevent(e.target.value)}
            >
              {prevents.map((item) => (
                <option key={item.prevent._id} value={item.prevent._id}>
                  {item.prevent.name} (Clientes: {item.totalClients} - Importe: $
                  {(item.prevent.price * item.totalClients).toFixed(2)})
                </option>
              ))}
            </Form.Control>
          </Card.Body>
        </Card>

        {/* Card for Entradas (Tickets) Table */}
        <Card className="shadow-sm">
          <Card.Header className="fw-bold">Entradas</Card.Header>
          <Card.Body>
            <EntradasSection clients={clients} onCreateQr={handleCreateQr} />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

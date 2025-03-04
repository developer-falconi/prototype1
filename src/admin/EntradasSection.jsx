import { useCallback, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { GET_TICKETS, CREATE_QR, GET_PREVENTS, REGENERATE_QR } from "../service/ticket.requests";
import EntradasTable from "./EntradasTable";
import "./entradas.scss";
import Swal from "sweetalert2";

export default function EntradasSection() {
  const [clients, setClients] = useState([]);
  const [prevents, setPrevents] = useState([]);
  const [activePrevent, setActivePrevent] = useState(null);

  // Loading states
  const [loadingPrevents, setLoadingPrevents] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Per-row loading map: { [voucherId]: "create" | "regenerate" | null }
  const [loadingRows, setLoadingRows] = useState({});

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

  // Generate a QR code for clients who don't have one
  const handleCreateQr = async (voucher) => {
    // Mark this voucher row as "creating"
    setLoadingRows((prev) => ({ ...prev, [voucher._id]: "create" }));

    const createTicketsData = {
      clients: voucher.clients,
      email: voucher.email,
      voucherId: voucher._id,
    };

    try {
      const clientsUpdated = await CREATE_QR(createTicketsData);
      if (clientsUpdated) {
        const updatedVouchers = clients.map((prevCli) =>
          prevCli._id === voucher._id
            ? { ...prevCli, clients: clientsUpdated }
            : prevCli
        );
        setClients(updatedVouchers);
      } else {
        Swal.fire({
          title: "Error al crear QR",
          text: "Ha ocurrido un error al crear el QR. Inténtelo de nuevo más tarde.",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error creating QR:", error);
    }

    // Unset loading
    setLoadingRows((prev) => ({ ...prev, [voucher._id]: null }));
  };

  // Regenerate a QR code
  const handleRegenerateQr = async (voucher) => {
    // Mark this voucher row as "regenerating"
    setLoadingRows((prev) => ({ ...prev, [voucher._id]: "regenerate" }));

    const createTicketsData = {
      clients: voucher.clients,
      email: voucher.email,
      voucherId: voucher._id,
    };

    try {
      const clientsUpdated = await REGENERATE_QR(createTicketsData);
      if (clientsUpdated) {
        const updatedVouchers = clients.map((prevCli) =>
          prevCli._id === voucher._id
            ? { ...prevCli, clients: clientsUpdated }
            : prevCli
        );
        setClients(updatedVouchers);
      } else {
        Swal.fire({
          title: "Error al regenerar QR",
          text: "Ha ocurrido un error al regenerar el QR. Inténtelo de nuevo más tarde.",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error creating QR:", error);
    }

    // Unset loading
    setLoadingRows((prev) => ({ ...prev, [voucher._id]: null }));
  };

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
          <EntradasTable
            clients={clients}
            onCreateQr={handleCreateQr}
            onRegenerateQr={handleRegenerateQr}
            loadingRows={loadingRows}  // pass the per-row loading map
          />
        )}
      </div>
    </div>
  );
}

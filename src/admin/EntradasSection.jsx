import { useCallback, useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { GET_TICKETS, CREATE_QR, GET_PREVENTS, REGENERATE_QR, DOWNLOAD_TICKETS_PREVENTA, DELETE_CLIENT } from "../service/ticket.requests";
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
  const [loadingDownload, setLoadingDownload] = useState(false);

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

  const handleDownloadEntradasPreventa = async () => {
    setLoadingDownload(true);
    try {
      const response = await DOWNLOAD_TICKETS_PREVENTA(activePrevent);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const prevent = prevents.find(p => p?.prevent?._id === activePrevent);
      const preventName = prevent?.prevent?.name?.replace(/\s+/g, "_");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `entradas_${preventName}.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    } finally {
      setLoadingDownload(false);
    }
  };

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

    // Unset loading for this client.
    setLoadingRows((prev) => ({ ...prev, [voucher._id]: null }));
  };

  const deleteClient = async (voucherId, clientId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro que deseas eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return;
    }

    const res = await DELETE_CLIENT(voucherId, clientId);
    if (res.success) {
      if (res.data) {
        const updatedVoucher = res.data;
        setClients((prevClients) =>
          prevClients.map((voucher) =>
            voucher._id === updatedVoucher._id ? updatedVoucher : voucher
          )
        );
      } else {
        setClients((prevClients) =>
          prevClients.filter((voucher) => voucher._id !== voucherId)
        );
      }

      Swal.fire({
        title: 'Eliminado correctamente!',
        icon: 'success'
      });
    };
  }

  return (
    <div className="entradas-full">
      <h2 className="entradas-title">Entradas</h2>
      <div className="toolbar-entradas">
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
        <Button
          variant="outline-primary"
          onClick={() => handleDownloadEntradasPreventa()}
        >
          {loadingDownload ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Descargar entradas enviadas"
          )}
        </Button>
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
            loadingRows={loadingRows}
            deleteClient={deleteClient}
          />
        )}
      </div>
    </div>
  );
}

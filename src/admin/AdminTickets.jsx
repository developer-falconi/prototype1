import { useCallback, useEffect, useState } from "react";
import { CREATE_QR, GET_PREVENTS, GET_TICKETS } from "../service/ticket.requests";
import { Button, Table, Tab, Tabs } from "react-bootstrap";
import './admin.scss';
import QRScanner from "../qr/QrScanner";
import { FaSquareCheck } from "react-icons/fa6";
import { tickets } from "../helpers/constants";
import UsedTickets from "./UsedTickets";

export default function AdminTickets() {

  const [clients, setClients] = useState([]);
  const [prevents, setPrevents] = useState([]);
  const [scan, setScan] = useState(false);
  const [activePreventa, setActivePreventa] = useState(null);
  const [showUsed, setShowUsed] = useState(false);
  const [usedTickets, setUsedTickets] = useState([]);

  const getClients = useCallback(async (prevent) => {
    try {
      const response = await GET_TICKETS(prevent);
      setClients(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }, []);

  const getPrevents = useCallback(async () => {
    try {
      const response = await GET_PREVENTS();
      setPrevents(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }, []);

  const handleCreateQr = async (voucher) => {
    const createTicketsData = {
      clients: voucher.clients,
      email: voucher.email
    }

    const clientsUpdated = await CREATE_QR(createTicketsData);
    const updatedVouchers = clients.map((prevCli) =>
      prevCli._id === voucher._id
        ? { ...prevCli, clients: clientsUpdated }
        : prevCli
    );
    setClients(updatedVouchers);
  };

  const handleScan = () => {
    setScan(true);
    setActivePreventa(null);
    setShowUsed(false);
  };

  const handleTabSelect = (preventaId) => {
    setScan(false);
    setActivePreventa(preventaId);
    getClients(preventaId);
    setShowUsed(false);
  };

  const handleUsedQr = () => {
    setScan(false);
    setUsedTickets(tickets);
    setShowUsed(true);
    setActivePreventa(null);
  };

  useEffect(() => {
    getPrevents();
  }, [getPrevents]);
  return (
    <>
    <div className="scanner">
      <Button onClick={handleScan}>Escanear</Button>
      {scan && <Button variant="secondary" onClick={() => setScan(false)}>Cerrar</Button>}
    </div>
    <div className="used">
      <Button onClick={handleUsedQr}>QR usados</Button>
      {showUsed && <Button variant="secondary" onClick={() => setShowUsed(false)}>Cerrar</Button>}
    </div>
      {showUsed && <UsedTickets usedTickets={usedTickets} />}
      <Tabs
        id="preventas-tabs"
        activeKey={activePreventa}
        onSelect={handleTabSelect}
      >
        {prevents.map((elem) => (
          <Tab
            key={elem.prevent._id}
            eventKey={elem.prevent._id}
            title={`${elem.prevent.name} Clientes=${elem.totalClients} Importe=$${(elem.prevent.price * elem.totalClients).toFixed(2)}`}
          >
            {
              activePreventa && (
                <Table striped bordered hover className="clients-to-approve">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Dni</th>
                      <th>Email</th>
                      <th>QR</th>
                      <th>Ticket</th>
                      <th>Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((voucher, voucherIndex) => (
                      voucher.clients.map((client, clientIndex) => (
                        <tr key={`${voucherIndex}-${clientIndex}`}>
                          <td>{client.fullName}</td>
                          <td>{client.dni}</td>
                          <td>{voucher.email}</td>
                          <td>{client.ticket ? <img src={client.ticket.url} alt="qr" /> : 'No QR Code'}</td>
                          <td>
                            {client.ticket ?
                              <FaSquareCheck />
                              : <Button onClick={() => handleCreateQr(voucher)}>Crear</Button>
                            }
                          </td>
                          <td>
                            <a href={voucher.url} target="_blank" rel="noopener noreferrer">
                              Comprobante
                            </a>
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </Table>
              )
            }
          </Tab>
        ))}
      </Tabs>
      {scan && <QRScanner />}
    </>
  );
}

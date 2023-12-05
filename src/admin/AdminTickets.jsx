import { useCallback, useEffect, useState } from "react";
import { CREATE_QR, GET_PREVENTS, GET_TICKETS } from "../service/ticket.requests";
import { Button, Table, Tab, Tabs } from "react-bootstrap";
import './admin.scss';
import QRScanner from "../qr/QrScanner";
import { FaSquareCheck } from "react-icons/fa6";

export default function AdminTickets() {

  const [clients, setClients] = useState([]);
  const [prevents, setPrevents] = useState([]);
  const [scan, setScan] = useState(false);
  const [activePreventa, setActivePreventa] = useState(null);

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
    console.log(voucher)
    const createTicketsData = {
      clients: voucher.clients,
      email: voucher.email
    }
    const res = await CREATE_QR(createTicketsData);
    // const voucherClients = clients.filter((elem) => elem.)
    console.log(res);
  };

  const handleScan = () => {
    setScan(true);
  };

  const handleTabSelect = (preventaId) => {
    setActivePreventa(preventaId);
    getClients(preventaId);
  };

  useEffect(() => {
    getPrevents();
  }, [getPrevents]);
  
  return (
    <>
      <Button onClick={handleScan}>Escanear</Button>
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
          </Tab>
        ))}
      </Tabs>

      {scan && <QRScanner />}
    </>
  );
}

import { useCallback, useEffect, useState } from "react";
import { CREATE_QR, GET_PREVENTS, GET_TICKETS } from "../service/ticket.requests";
import { Button, Table, Tab, Tabs } from "react-bootstrap";
import './admin.scss';
import QRScanner from "../qr/QrReader";
import { FaSquareCheck } from "react-icons/fa6";
import QrCode from "../qr/QrCode";

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

  const handleCreateQr = async (client) => {
    const res = await CREATE_QR(client);
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
          <Tab key={elem._id} eventKey={elem._id} title={`${elem.name} ${elem.price}`}>
            <Table striped bordered hover className="clientsToApprove">
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
                {clients.map((preventa, preventaIndex) => (
                  preventa.clients.map((client, clientIndex) => (
                    <tr key={`${preventaIndex}-${clientIndex}`}>
                      <td>{client.fullName}</td>
                      <td>{client.dni}</td>
                      <td>{preventa.email}</td>
                      <td>{client.ticket ? <QrCode ticket={client.ticket} /> : 'No QR Code'}</td>
                      <td>
                        {client.ticket ?
                          <FaSquareCheck />
                          : <Button onClick={() => handleCreateQr(client)}>Crear</Button>
                        }
                      </td>
                      <td>
                        <a href={preventa.url} target="_blank" rel="noopener noreferrer">
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

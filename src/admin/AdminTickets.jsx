import { useCallback, useEffect, useState } from "react";
import { GET_TICKETS } from "../service/ticket.requests";
import { Button, Table } from "react-bootstrap";
import './admin.scss';
import QRScanner from "./QrReader";

export default function AdminTickets() {
  const [clients, setClients] = useState([]);
  const [scan, setScan] = useState(false);

  const getClients = useCallback(async () => {
    try {
      const response = await GET_TICKETS();
      setClients(response);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }, []);

  const handleScan = () => {
    setScan(true)
  }

  useEffect(() => {
    getClients();
  }, [getClients]);

  return (
    <>
      <Button onClick={handleScan}>Escanear</Button>
      <Table striped bordered hover className="clientsToApprove">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dni</th>
            <th>Email</th>
            <th>Ticket</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((elem, ind) => (
            <tr key={ind}>
              <td>{elem.fullName}</td>
              <td>{elem.dni}</td>
              <td>{elem.email}</td>
              <td>
                {
                  elem.ticket ? 'Tiene' : 'Crear'
                }
              </td>
              <td>
                <a href={elem.comprobante} target="_blank" rel="noopener noreferrer">
                  Comprobante
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {
        scan && <QRScanner />
      }
    </>
  );
}
import { Table, Button } from "react-bootstrap";
import { FaSquareCheck } from "react-icons/fa6";

export default function EntradasTable({ clients, onCreateQr }) {
  return (
    <div className="entradas-table">
      <Table striped hover responsive className="clients-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Email</th>
            <th>QR</th>
            <th>Ticket</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((voucher, voucherIndex) =>
            voucher.clients.map((client, clientIndex) => (
              <tr key={`${voucherIndex}-${clientIndex}`}>
                <td>{client.fullName}</td>
                <td>{client.dni}</td>
                <td>{voucher.email}</td>
                <td>
                  {client.ticket ? (
                    <img
                      src={client.ticket.url}
                      alt="QR Code"
                      style={{ width: "60px", borderRadius: "4px" }}
                    />
                  ) : (
                    "No QR Code"
                  )}
                </td>
                <td>
                  {client.ticket ? (
                    <FaSquareCheck
                      style={{ color: "#28a745", fontSize: "1.2rem" }}
                    />
                  ) : (
                    <Button
                      variant="outline-primary"
                      onClick={() => onCreateQr(voucher)}
                    >
                      Crear
                    </Button>
                  )}
                </td>
                <td>
                  <a href={voucher.url} target="_blank" rel="noopener noreferrer">
                    Ver Comprobante
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

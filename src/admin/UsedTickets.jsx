import { DateTime } from "luxon"
import { Table } from "react-bootstrap"

export default function UsedTickets({ usedTickets }) {
  return (
    <Table striped bordered hover className="clients-to-approve">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dni</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {usedTickets.map((ticket, index) => (
          <tr key={index}>
            <td>{ticket.name}</td>
            <td>{ticket.dni}</td>
            <td>{DateTime.fromISO(ticket.date).toFormat("dd/MM/yyyy HH:mm")}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
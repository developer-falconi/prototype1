import React, { useState } from "react";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const VOUCHER_HEADER_COLOR = "#e6f7ff";

export default function EntradasTable({
  clients,
  onCreateQr,
  onRegenerateQr,
  loadingRows
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUsed, setFilterUsed] = useState(false);
  const [filterSent, setFilterSent] = useState(false);
  const [collapsedVouchers, setCollapsedVouchers] = useState({});

  if (!clients || clients.length === 0) {
    return (
      <div className="entradas-table no-entradas">
        <p>No hay entradas</p>
      </div>
    );
  }

  // 1. Filter each voucher’s clients
  const filteredVouchers = clients
    .map((voucher) => {
      const filteredClients = voucher.clients.filter((client) => {
        const query = searchQuery.toLowerCase();
        const fullNameMatch = client.fullName?.toLowerCase().includes(query);
        const dniMatch = client.dni?.toLowerCase().includes(query);
        const emailMatch = voucher.email?.toLowerCase().includes(query);
        const searchMatch = !searchQuery || fullNameMatch || dniMatch || emailMatch;

        const usedMatch = !filterUsed || (client.ticket && client.ticket.used);
        const sentMatch = !filterSent || (client.ticket && client.ticket.sent);

        return searchMatch && usedMatch && sentMatch;
      });
      return { ...voucher, clients: filteredClients };
    })
    .filter((voucher) => voucher.clients.length > 0);

  // Toggle collapsed state for a voucher
  const toggleVoucher = (voucherId) => {
    setCollapsedVouchers((prev) => ({
      ...prev,
      [voucherId]: !prev[voucherId],
    }));
  };

  return (
    <div className="entradas-table">
      {/* Toolbar */}
      <div className="toolbar d-flex align-items-center gap-3 mb-3">
        <Form.Control
          className="input-toolbar"
          type="text"
          placeholder="Buscar por nombre, DNI o email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="d-flex gap-2 filters">
          <Form.Check
            type="checkbox"
            label="Usados"
            checked={filterUsed}
            onChange={(e) => setFilterUsed(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Enviados"
            checked={filterSent}
            onChange={(e) => setFilterSent(e.target.checked)}
          />
        </div>
      </div>

      {/* Table */}
      <Table striped hover responsive className="clients-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Email</th>
            <th>QR</th>
            <th>Enviado</th>
            <th>Ticket</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.map((voucher) => {
            // Determine if this voucher is currently "creating" or "regenerating"
            const rowLoadingState = loadingRows[voucher._id] || null;
            return (
              <React.Fragment key={voucher._id}>
                {/* Voucher Header Row */}
                <tr
                  className="voucher-row"
                  style={{
                    backgroundColor: VOUCHER_HEADER_COLOR,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleVoucher(voucher._id)}
                >
                  <td colSpan={7}>
                    {collapsedVouchers[voucher._id] ? (
                      <FaChevronRight style={{ marginRight: "0.5rem" }} />
                    ) : (
                      <FaChevronDown style={{ marginRight: "0.5rem" }} />
                    )}
                    <strong>Voucher:</strong> {voucher._id} &nbsp;|&nbsp;
                    <strong>Email:</strong> {voucher.email}
                  </td>
                </tr>

                {/* Only show the voucher's clients if not collapsed */}
                {!collapsedVouchers[voucher._id] &&
                  voucher.clients.map((client, clientIndex) => (
                    <tr key={`${voucher._id}-${clientIndex}`}>
                      <td>{client.fullName}</td>
                      <td>{client.dni}</td>
                      <td>{voucher.email}</td>
                      <td>
                        {client?.ticket?.url ? (
                          <img
                            src={client.ticket.url}
                            alt="QR Code"
                            style={{ width: "60px", borderRadius: "4px" }}
                          />
                        ) : (
                          "No QR Code"
                        )}
                      </td>
                      <td>{voucher.sent ? "SI" : "NO"}</td>
                      <td>
                        {client.ticket ? (
                          <Button
                            variant="outline-primary"
                            onClick={() => onRegenerateQr(voucher)}
                          >
                            {rowLoadingState === "regenerate" ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Regenerar"
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="outline-primary"
                            onClick={() => onCreateQr(voucher)}
                          >
                            {rowLoadingState === "create" ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Crear"
                            )}
                          </Button>
                        )}
                      </td>
                      <td>
                        <a
                          href={voucher.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver Comprobante
                        </a>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

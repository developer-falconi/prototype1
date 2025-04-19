// TicketTemplate.jsx
import { useState } from "react";
import "./ticket-template.scss";
import ClientUpload from "../client/ClientUpload";
import { formatPrice, formatToBuenosAires } from "../helpers/constants";
import { DateTime } from "luxon";

export default function TicketTemplate({ prevent, activeEvent, image }) {
  const [qtity, setQtity] = useState(1);
  const price = prevent ? parseFloat(prevent.price) : 0;
  const [total, setTotal] = useState(price);
  const [totalClients, setTotalClients] = useState(qtity);
  const [showCreate, setShowCreate] = useState(false);

  const handleMinusQtity = () => {
    if (qtity > 1) {
      const next = qtity - 1;
      setQtity(next);
      setTotal(price * next);
      setTotalClients(next);
    }
  };

  const handlePlusQtity = () => {
    if (qtity < 10) {
      const next = qtity + 1;
      setQtity(next);
      setTotal(price * next);
      setTotalClients(next);
    }
  };

  return (
    <main className="new-ticket-system">
      <div className="ticket-card">
        <div className="ticket-header">
          <h2 className="location">{activeEvent?.name || "Evento sin nombre"}</h2>
          <img src={image} alt="Logo" className="logo-img" />
        </div>

        <div className="ticket-details">
          <div className="detail">
            <span>Fecha:</span>
            <p>
              {activeEvent?.startDate
                ? DateTime.fromISO(activeEvent.startDate).toFormat("dd/MM/yyyy")
                : "N/A"}
            </p>
          </div>
          <div className="detail">
            <span>Inicia:</span>
            <p>
              {activeEvent?.startDate
                ? formatToBuenosAires(activeEvent.startDate).split(" ")[1]
                : "N/A"}
            </p>
          </div>
          <div className="detail">
            <span>Finaliza:</span>
            <p>
              {activeEvent?.endDate
                ? formatToBuenosAires(activeEvent.endDate).split(" ")[1]
                : "N/A"}
            </p>
          </div>
          <div className="detail">
            <span>Ubicación:</span>
            <p>{activeEvent?.location || "N/A"}</p>
          </div>
        </div>

        <div className="ticket-footer">
          {prevent && prevent.status === "ACTIVE" ? (
            <>
              <h3>
                {prevent.name} | {formatPrice(price)}
              </h3>
              <div className="quantity-controls">
                <button onClick={handleMinusQtity} className="minus-btn">
                  –
                </button>
                <span>{qtity}</span>
                <button onClick={handlePlusQtity} className="plus-btn">
                  +
                </button>
              </div>
              <p>Total: {formatPrice(total)}</p>
              <button
                className="purchase-btn"
                onClick={() => setShowCreate(true)}
                disabled={qtity < 1}
              >
                Comprar
              </button>
            </>
          ) : (
            <h3 className="sold-out">Sold Out</h3>
          )}
        </div>
      </div>

      <ClientUpload
        showCreate={showCreate}
        setShowCreate={setShowCreate}
        totalClients={totalClients}
        setTotalClients={setTotalClients}
        totalPrice={total}
        setTotalPrice={setTotal}
        prevent={prevent}
        event={activeEvent}
      />
    </main>
  );
}

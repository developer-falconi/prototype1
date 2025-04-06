import { AdvancedImage } from "@cloudinary/react";
import "./ticket-template.scss";
import { cloudinaryImg } from "../helpers/cloudinary";
import { useState } from "react";
import ClientUpload from "../client/ClientUpload";
import { formatPrice, formatToBuenosAires } from "../helpers/constants";
import { DateTime } from "luxon";

const teroImg = "FlyerLogoCrop_lzzufk.png";

export default function TicketTemplate({ prevent, activeEvent, image }) {
  const [qtity, setQtity] = useState(1);
  const price = prevent ? parseFloat(prevent.price) : 0;
  const [total, setTotal] = useState(price);
  const [totalClients, setTotalClients] = useState(qtity);
  const [showCreate, setShowCreate] = useState(false);

  const handleMinusQtity = () => {
    if (qtity > 1) {
      const newQtity = qtity - 1;
      setQtity(newQtity);
      setTotal(price * newQtity);
      setTotalClients(newQtity);
    }
  };

  const handlePlusQtity = () => {
    if (qtity < 10) {
      const newQtity = qtity + 1;
      setQtity(newQtity);
      setTotal(price * newQtity);
      setTotalClients(newQtity);
    }
  };

  const handleUploadClients = () => {
    setShowCreate(true);
  };

  return (
    <main className="new-ticket-system">
      <div className="ticket-card">
        <div className="ticket-header">
          <h2 className="location">
            {activeEvent?.name || "Evento sin nombre"}
          </h2>
          <img
            // cldImg={cloudinaryImg(teroImg)}
            src={image}
            alt="tero"
            className="logo-img"
          />
        </div>
        <div className="ticket-details">
          <div className="detail">
            <span>Date:</span>
            <p>{DateTime.fromISO(activeEvent.startDate).toFormat("dd/MM/yyyy")}</p>
          </div>
          <div className="detail">
            <span>Start:</span>
            <p>
              {activeEvent?.startDate
                ? formatToBuenosAires(activeEvent.startDate).split(' ')[1]
                : "N/A"}
            </p>
          </div>
          <div className="detail">
            <span>End:</span>
            <p>
              {activeEvent?.endDate
                ? formatToBuenosAires(activeEvent.endDate).split(' ')[1]
                : "N/A"}
            </p>
          </div>
          <div className="detail">
            <span>Bar:</span>
            <p>N/A</p>
          </div>
          <div className="detail">
            <span>Venue:</span>
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
                <button className="minus-btn" onClick={handleMinusQtity}>
                  -
                </button>
                <span>{qtity}</span>
                <button className="plus-btn" onClick={handlePlusQtity}>
                  +
                </button>
              </div>
              <p>Total: {formatPrice(total)}</p>
              <button
                className="purchase-btn"
                onClick={handleUploadClients}
                disabled={prevent.status !== "ACTIVE" || qtity === 0}
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

import { AdvancedImage } from '@cloudinary/react';
import './ticket-template.scss';
import { cloudinaryImg } from '../helpers/cloudinary';
import { useState } from 'react';
import ClientUpload from '../client/ClientUpload';
import { formatPrice } from '../helpers/constants';
import { DateTime } from 'luxon';

const teroImg = 'FlyerLogoCrop_lzzufk.png';

export default function TicketTemplate({ prevent, activeEvent }) {
  const [qtity, setQtity] = useState(1);
  const [total, setTotal] = useState(prevent?.price);
  const [totalClients, setTotalClients] = useState(qtity);
  const [showCreate, setShowCreate] = useState(false);

  const handleMinusQtity = () => {
    if (qtity >= 1) {
      const newQtity = qtity - 1;
      setQtity(newQtity);
      setTotal(prevent.price * newQtity);
      setTotalClients(newQtity);
    }
  };

  const handlePlusQtity = () => {
    if (qtity < 10) {
      const newQtity = qtity + 1;
      setQtity(newQtity);
      setTotal(prevent.price * newQtity);
      setTotalClients(newQtity);
    }
  };

  const handleUploadClients = () => {
    setShowCreate(true);
  };

  const formattedDate = DateTime.fromISO(activeEvent.date).toFormat("dd-MM-yyyy");

  return (
    <main className="new-ticket-system">
      <div className="ticket-card">
        <div className="ticket-header">
          <h2 className="location">{activeEvent.name}</h2>
          <AdvancedImage cldImg={cloudinaryImg(teroImg)} alt="tero" className="logo-img" />
        </div>
        <div className="ticket-details">
          {/* <div className="detail">
            <span>No.:</span>
            <p>{activeEvent.number}</p>
          </div> */}
          <div className="detail">
            <span>Date:</span>
            <p>{formattedDate}</p>
          </div>
          <div className="detail">
            <span>Hours:</span>
            <p>{activeEvent.hours}</p>
          </div>
          <div className="detail">
            <span>Bar:</span>
            <p>{activeEvent.bar}</p>
          </div>
          <div className="detail">
            <span>Venue:</span>
            <p>{activeEvent.venue}</p>
          </div>
        </div>
        <div className="ticket-footer">
          {
            prevent.active ? (
              <>
                <h3>{prevent?.name} | {formatPrice(prevent?.price)}</h3>
                <div className="quantity-controls">
                  <button className="minus-btn" onClick={handleMinusQtity}>-</button>
                  <span>{qtity}</span>
                  <button className="plus-btn" onClick={handlePlusQtity}>+</button>
                </div>
                <p>Total: {formatPrice(total)}</p>
                <button
                  className="purchase-btn"
                  onClick={handleUploadClients}
                  disabled={!prevent.active || qtity === 0}
                >
                  Comprar
                </button>
              </>
            ) : (
              <h3 className='sold-out'>Sold Out</h3>
            )
          }
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
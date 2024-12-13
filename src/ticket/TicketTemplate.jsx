import { AdvancedImage } from '@cloudinary/react';
import './ticket-template.scss';
import { cloudinaryImg } from '../helpers/cloudinary';
import { useState } from 'react';
import ClientUpload from '../client/ClientUpload';
import { formatPrice } from '../helpers/constants';

const teroImg = 'Tero_Negro_1_n88cta.png';

export default function TicketTemplate({ prevent }) {
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

  return (
    <main className="new-ticket-system">
      <div className="ticket-card">
        <div className="ticket-header">
          <h2 className="location">CSB</h2>
          <AdvancedImage cldImg={cloudinaryImg(teroImg)} alt="tero" className="logo-img" />
          <h2 className="seat-number">1°B</h2>
        </div>
        <div className="ticket-details">
          <div className="detail">
            <span>Party:</span>
            <p>Fiesta Fin De Año</p>
          </div>
          <div className="detail">
            <span>No.:</span>
            <p>VII</p>
          </div>
          <div className="detail">
            <span>Departure:</span>
            <p>21/12/2024 23:30</p>
          </div>
          <div className="detail">
            <span>Gate Closes:</span>
            <p>02:00</p>
          </div>
          <div className="detail">
            <span>Luggage:</span>
            <p>Barra Libre</p>
          </div>
          <div className="detail">
            <span>Seat:</span>
            <p>1-B</p>
          </div>
        </div>
        <div className="ticket-footer">
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
      />
    </main>
  );
}
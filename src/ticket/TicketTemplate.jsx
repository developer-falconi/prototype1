import { AdvancedImage } from '@cloudinary/react';
import './ticket-template.scss';
import { cloudinaryImg } from '../helpers/cloudinary';
import { useState } from 'react';
import ClientUpload from '../client/ClientUpload';

const teroImg = 'Vanellus/Tero_Negro_wupuho.png';

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
  }

  const handlePlusQtity = () => {
    if (qtity < 10) {
      const newQtity = qtity + 1;
      setQtity(newQtity);
      setTotal(prevent.price * newQtity);
      setTotalClients(newQtity);
    }
  }

  const handleUploadClients = () => {
    setShowCreate(true);
  }

  return (
    <main className="ticket-system">
      <div className="top">
        <div className="printer" />
      </div>
      <div className="receipts-wrapper">
        <div className="receipts">
          <div className="receipt">
            <div className="route">
              <h2>CSB</h2>
              <AdvancedImage cldImg={cloudinaryImg(teroImg)} alt='tero' className='tero-img' />
              <h2>ATL</h2>
            </div>
            <div className="details">
              <div className="item">
                <span>Party</span>
                <h3>Vanellus</h3>
              </div>
              <div className="item">
                <span>No.</span>
                <h3>V</h3>
              </div>
              <div className="item">
                <span>Departure</span>
                <h3>23/03/2024 12:00</h3>
              </div>
              <div className="item">
                <span>Gate Closes</span>
                <h3>02:00</h3>
              </div>
              <div className="item">
                <span>Luggage</span>
                <h3>Barra Libre</h3>
              </div>
              <div className="item">
                <span>Seat</span>
                <h3>69P</h3>
              </div>
            </div>
          </div>
          <div className="receipt qr-code">
            <div className="title-default">
              <h2 className="name-default">{prevent.name}</h2>
              <p className='price-default'>${prevent.price}</p>
              <div className="qtity-buttons">
                <button className="minus-btn" onClick={handleMinusQtity}>-</button>
                <span className="qtity-value">{qtity}</span>
                <button className="plus-btn" onClick={handlePlusQtity}>+</button>
              </div>
            </div>
            <div className="details-prevent">
              <div className="total-value">${total}</div>
              <button
                className="comprar-button"
                variant="success"
                onClick={handleUploadClients}
                disabled={!prevent.active || qtity === 0}
              >
                Comprar
              </button>
            </div>
          </div>
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
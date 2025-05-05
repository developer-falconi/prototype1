import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import EventCard from './EventCard';

export default function EventsCanvas({ events = [] }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow  = () => setShow(true);

  return (
    <>
      <Button
        variant="secondary"
        className="bg-dark border-0"
        onClick={handleShow}
      >
        Eventos
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton className="bg-dark text-light">
          <Offcanvas.Title>Eventos Anteriores</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="bg-dark text-light">
          {events.length > 0 ? (
            <>
              {events.filter(e => e.status !== 'ACTIVE').map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </>
          ) : (
            <p className="text-center">No hay eventos para mostrar.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

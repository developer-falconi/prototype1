import { useEffect, useState } from "react";
import "./ticket.scss";
import { GET_PRODUCER_DATA } from "../service/ticket.requests";
import Loader from "../loader/Loader";
import TicketTemplate from "./TicketTemplate";
import EventsCanvas from "./EventsOffCanva";

export default function TicketMain() {
  const [isLoading, setIsLoading] = useState(true);
  const [producerData, setProducerData] = useState(null);

  useEffect(() => {
    GET_PRODUCER_DATA()
      .then((res) => {
        setProducerData(res.data);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;
  if (!producerData) return <div>Error cargando datos del productor.</div>;

  const activeEvent = producerData.events?.[0];
  const prevent = activeEvent?.prevents?.[0];

  const contactUser = producerData.users?.[0] || {};
  const contactPhone = contactUser.phone;
  const contactHref = contactPhone
    ? `https://wa.me/${contactPhone}?text=Hola!%20Necesito%20entradas%20para%20${activeEvent.name}`
    : `mailto:${producerData.email?.email}`;

  return (
    <div className="content-page d-flex flex-column">
      <header className="ticket-header w-100 d-flex justify-content-between align-items-center p-4 bg-gradient-primary shadow-sm">
        <div className="producer-info d-flex align-items-center">
          {producerData.logoUrl && (
            <img
              src={producerData.logoUrl}
              alt={producerData.name}
              className="producer-logo me-3"
            />
          )}
          <h1 className="producer-name text-white mb-0">{producerData.name}</h1>
        </div>
        <EventsCanvas events={producerData.events} />
      </header>

      <div className="prevent-tickets">
        {activeEvent ? (
          <TicketTemplate
            activeEvent={activeEvent}
            prevent={prevent}
          />
        ) : (
          <div className="create-event-label">
            <p>
              No se encontró un evento activo o preventas. Por favor, crea un
              evento y asigna las preventas correspondientes.
            </p>
          </div>
        )}
        <h2 className="info-help">
          Por cualquier problema comunicarse con{" "}
          <a href={contactHref} target="_blank" rel="noreferrer">Organizador</a>
        </h2>
      </div>
      <div className="d-flex w-100 justify-content-center align-items-center text-light">
        <p className="p-2 rounded-3 m-0">
          Este evento fue creado con <a href="https://ticketera-fe.vercel.app/">Ticketera</a>
        </p>
      </div>
    </div>
  );
}

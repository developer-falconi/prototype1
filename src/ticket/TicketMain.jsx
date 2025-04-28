import { useEffect, useState } from "react";
import "./ticket.scss";
import { GET_PRODUCER_DATA } from "../service/ticket.requests";
import Loader from "../loader/Loader";
import TicketTemplate from "./TicketTemplate";

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
    <div className="content-page">
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
    </div>
  );
}

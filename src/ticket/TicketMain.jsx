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
      .then((producerRes) => {
        setProducerData(producerRes.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setIsLoading(false);
      });
  }, []);

  const contactPhone = producerData?.users?.[0]?.phone;
  const contactName = producerData?.users?.[0]?.fullName;

  const activeEvent = producerData?.events?.[0];

  const hasActiveEventWithPrevent = Boolean(activeEvent);

  return (
    <div className="content-page">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="prevent-tickets">
            {hasActiveEventWithPrevent ? (
              <TicketTemplate
                image={producerData.logo}
                activeEvent={activeEvent}
                prevent={activeEvent?.prevent?.[0]}
              />
            ) : (
              <div className="create-event-label">
                <p>
                  No se encontró un evento activo o preventas. Por favor, crea un evento y asigna las preventas correspondientes.
                </p>
              </div>
            )}
            <h2 className="info-help">
              Por cualquier problema comunicarse con{" "}
              <a
                href={`https://wa.me/${contactPhone}?text=Hola!%20Necesito%20entradas%20para%20la%20Envuelto`}
                rel="noreferrer"
                target="_blank"
              >
                {contactName}
              </a>
            </h2>
          </div>
          <img src={producerData.logo} alt="img" className="flyer-img" />
        </>
      )}
    </div>
  );
}

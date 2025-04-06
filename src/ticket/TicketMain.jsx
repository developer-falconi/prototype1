import { useEffect, useState } from "react";
import "./ticket.scss";
import { GET_PRODUCER_DATA } from "../service/ticket.requests";
import Loader from "../loader/Loader";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../helpers/cloudinary";
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

  // Use phone if available, otherwise fallback to contactEmail for WhatsApp link
  const contact = producerData?.phone || producerData?.contactEmail || "";

  return (
    <div className="content-page">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="prevent-tickets">
            <TicketTemplate
              image={producerData.logo}
              activeEvent={producerData.events[0]}
              prevent={producerData.events[0]?.prevents[0]}
            />
            <h2 className="info-help">
              Por cualquier problema comunicarse con{" "}
              <a
                href={`https://wa.me/${contact}?text=Hola!%20Necesito%20entradas%20para%20la%20Envuelto`}
                rel="noreferrer"
                target="_blank"
              >
                {producerData?.contactEmail}
              </a>
            </h2>
          </div>
          <img
            src={producerData.logo}
            alt="img"
            className="flyer-img"
          />
        </>
      )}
    </div>
  );
}

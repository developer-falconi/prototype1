import { useEffect, useState } from "react";
import './ticket.scss';
import { GET_ACTIVE_PREVENT, GET_EVENT_DATA } from "../service/ticket.requests";
import Loader from "../loader/Loader";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../helpers/cloudinary";
import TicketTemplate from "./TicketTemplate";

const img = 'FlyerLogo.jpg'
const img2 = 'FlyerLogo.jpg'

export default function TicketMain() {
  const [isLoading, setIsLoading] = useState([]);
  const [prevent, setPrevent] = useState();
  const [activeEvent, setActiveEvent] = useState();

  useEffect(() => {
    Promise.all([GET_ACTIVE_PREVENT(), GET_EVENT_DATA()])
      .then(([preventRes, eventRes]) => {
        setPrevent(preventRes);
        setActiveEvent(eventRes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="content-page">
      {
        isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="prevent-tickets">
              <TicketTemplate prevent={prevent} activeEvent={activeEvent} />
              <h2 className="info-help">
                Por cualquier problema comunicarse con <a
                  href="https://wa.me/+54911<numero>?text=Hola!%20Necesito%20entradas%20para%20la%20Envuelto"
                  rel="noreferrer"
                  target="_blank"
                >Ramiro</a>
              </h2>
            </div>
            <AdvancedImage cldImg={cloudinaryImg(window.innerWidth > 521 ? img : img2)} alt='img' className='flyer-img' />
          </>
        )
      }
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import './ticket.scss';
import { GET_ACTIVE_PREVENT } from "../service/ticket.requests";
import Loader from "../loader/Loader";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../helpers/cloudinary";
import TicketTemplate from "./TicketTemplate";

const img = 'WhatsApp_Image_2024-12-13_at_11.48.23_vmtvv8.jpg'
const img2 = 'WhatsApp_Image_2024-12-13_at_11.48.232_fd0euk.jpg'

export default function TicketMain() {
  const [isLoading, setIsLoading] = useState([]);
  const [prevent, setPrevent] = useState();

  const getActivePrevent = useCallback(async () => {
    await GET_ACTIVE_PREVENT().then((res) => {
      setIsLoading(false);
      setPrevent(res);
    })
  }, [])

  useEffect(() => {
    getActivePrevent();
  }, [getActivePrevent])

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
              <TicketTemplate prevent={prevent} />
              <h2 className="info-help">
                Por cualquier problema comunicarse con <a
                  href="https://wa.me/+5491126075657?text=Hola!%20Necesito%20entradas%20para%20la%20Vanellus"
                  rel="noreferrer"
                  target="_blank"
                >Esteban</a>
              </h2>
            </div>
            <AdvancedImage cldImg={cloudinaryImg(window.innerWidth > 521 ? img : img2)} alt='img' className='flyer-img' />
          </>
        )
      }
    </div>
  );
}

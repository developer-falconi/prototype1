import { useCallback, useEffect, useState } from "react";
import './ticket.scss';
import { GET_ACTIVE_PREVENT } from "../service/ticket.requests";
import Loader from "../loader/Loader";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../helpers/cloudinary";
import TicketTemplate from "./TicketTemplate";

const img = 'Flyercrop1.jpg'
const img2 = 'Flyer1.jpg'
// const img3 = 'Vanellus/Ppal/f03e7805-0443-4b90-be25-414c3f5ef007_variated_wkxufe'

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

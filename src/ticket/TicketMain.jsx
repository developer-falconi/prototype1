import { useCallback, useEffect, useState } from "react";
import './ticket.scss';
import { GET_PREVENTS } from "../service/ticket.requests";
import Prevent from "./Prevent";
import Loader from "../loader/Loader";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../helpers/cloudinary";

const img = 'Vanellus/Ppal/Flyercrop_skfynv'
const img2 = 'Vanellus/Ppal/Flyer_fgwdm5'
const img3 = 'Vanellus/Ppal/f03e7805-0443-4b90-be25-414c3f5ef007_variated_wkxufe'

export default function TicketMain() {

  const [prevents, setPrevents] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const getPrevents = useCallback(async () => {
    await GET_PREVENTS().then((res) => {
      setIsLoading(false)
      setPrevents(res)
    })
  }, [])

  useEffect(() => {
    getPrevents();
  }, [getPrevents])

  return (
    <div className="content-page">
      {
        isLoading ? (
          <>
            <Loader />
            {/* <AdvancedImage cldImg={cloudinaryImg(img3)} alt='ghosts' className='ghost-img' /> */}
          </>
        ) : (
          <>
            <div className="prevent-tickets">
              <h1>FANTOM 9/12</h1>
              {
                prevents.map((elem) => {
                  return <Prevent key={elem.prevent._id} prevent={elem.prevent} />
                })
              }
              <h2 className="info-help">
                Por cualquier problema comunicarse con <a
                  href="https://wa.me/+5491161569011?text=Hola!%20Necesito%20entradas%20para%20la%20Fantom"
                  rel="noreferrer"
                  target="_blank"
                >Mateo</a>
              </h2>
            </div>
            <AdvancedImage cldImg={cloudinaryImg(window.innerWidth > 521 ? img : img2)} alt='img' className='flyer-img' />
          </>
        )
      }
    </div>
  );
}

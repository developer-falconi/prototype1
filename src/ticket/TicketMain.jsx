import { useCallback, useEffect, useState } from "react";
import img from '../Flyercrop.jpg';
import img2 from '../Flyer.jpg';
import './ticket.scss';
import { GET_PREVENTS } from "../service/ticket.requests";
import Prevent from "./Prevent";

export default function TicketMain() {

  const [prevents, setPrevents] = useState([]);

  const getPrevents = useCallback(async () => {
    const res = await GET_PREVENTS()
    setPrevents(res)
  }, [])

  useEffect(() => {
    getPrevents()
  }, [getPrevents])

  return (
    <div className="content-page">
      <div className="prevent-tickets">
        <h1>FANTOM 9/12</h1>
        {
          prevents.map((elem) => {
            return <Prevent key={elem._id} prevent={elem} />
          })
        }

      </div>
      <img src={window.innerWidth > 521 ? img : img2} alt='img' className='flyer-img' />
    </div>
  );
}

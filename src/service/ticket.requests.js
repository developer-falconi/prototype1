import Swal from "sweetalert2"
import { Methods } from "../helpers/constants"
import { request } from "./request"
import axios from "axios"

const VANELLUS_BE = process.env.REACT_APP_VANELLUS_BE

export const CREATE_CLIENT = async (clientData, eventId, comprobanteFile) => {
  try {
    const formData = new FormData();
    formData.append('comprobante', comprobanteFile);
    formData.append('clients', JSON.stringify(clientData));

    const res = await request(Methods.POST, `http://localhost:4000/api/client/create/${eventId}`, null, formData);
    // const res = await request(Methods.POST, `${VANELLUS_BE}/client/create/${eventId}`, null, clientData)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const UPLOAD_COMPROBANTE = async (comprobante, eventId) => {
  try {
    const config = {
      method: Methods.POST,
      url: `${VANELLUS_BE}/cloudinary/upload?event=${eventId}`,
      params: null,
      data: comprobante,
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
    const res = await axios(config)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const GET_TICKETS = async (prevent) => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/ticket?prevent=${prevent}`, null, null)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}

export const GET_ACTIVE_PREVENT = async () => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/prevent/active`, null, null)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}

export const GET_EVENT_DATA = async () => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/event`, null, null)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}

export const GET_PRODUCER_DATA = async () => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/producer/domain`, null, null)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}
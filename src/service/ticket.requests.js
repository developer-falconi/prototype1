import Swal from "sweetalert2"
import { Methods } from "../helpers/constants"
import { request } from "./request"
import errorHandler from "../helpers/errorHandler"
import axios from "axios"

const VANELLUS_BE = process.env.REACT_APP_VANELLUS_BE
const VANELLUS_UPLOAD = process.env.REACT_APP_VANELLUS_UPLOAD

export const CREATE_TICKET = async (clientData) => {
  try {
    const res = await request(Methods.POST, `http://localhost:4001/ticket/create`, null, clientData)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const UPLOAD_COMPROBANTE = async (comprobante) => {
  try {
    const config = {
      method: Methods.POST,
      url: `${VANELLUS_UPLOAD}/upload`,
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

export const VERIFY_TOKEN = async () => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/ticket/verify-token`, null, null)
    return res?.data
  } catch (error) {
    return errorHandler(error)
  }
}

export const CREATE_QR = async (ticketsData) => {
  try {
    const res = await request(Methods.POST, `${VANELLUS_BE}/ticket/createQr`, null, ticketsData)
    return res?.data
  } catch (error) {
    return errorHandler(error)
  }
}

export const GET_PREVENTS = async () => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/ticket/getPrevents`, null, null)
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
    const res = await request(Methods.GET, `${VANELLUS_BE}/ticket/get-active-prevent`, null, null)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}

export const GET_DOWNLOAD_EXCEL = async () => {
  try {
    const response = await axios.get(`${VANELLUS_BE}/ticket/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'entradas.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error downloading the file', error);
  }
}

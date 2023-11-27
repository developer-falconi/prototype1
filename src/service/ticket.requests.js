import Swal from "sweetalert2"
import { Methods } from "../helpers/constants"
import { request } from "./request"

const VANELLUS_BE = 'http://localhost:4000'

export const CREATE_TICKET = async (clientData) => {
  try {
    const res = await request(Methods.POST, `${VANELLUS_BE}/ticket/create`, null, clientData)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}

export const GET_TICKETS = async () => {
  try {
    const res = await request(Methods.GET, `${VANELLUS_BE}/ticket`, null, null)
    return res.data
  } catch (error) {
    console.log(error)
    return Swal.fire({
      title: 'Error',
      text: 'Intentalo devuelta'
    })
  }
}
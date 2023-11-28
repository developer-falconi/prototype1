import axios from "axios";
import Swal from 'sweetalert2';

export const request = async (method, url, params, data) => {

  let token = localStorage.getItem('token')

  const config = {
    method: method,
    url: url,
    params: params,
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error)
    Swal.fire({
      title: 'Error!',
      text: `No estas logueado`,
      icon: 'error',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false
    })
      .then(() => {
        if (process.env.REACT_APP_ERROR_HANDLERS === 'true') {
          window.location.href = '/'
        }
      })
    throw new Error(error);
  }
}

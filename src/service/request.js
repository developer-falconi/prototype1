import axios from "axios";
import Swal from 'sweetalert2';

export const request = async (method, url, params, data) => {
  const config = {
    method: method,
    url: url,
    params: params,
    data: data
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error)
    Swal.fire({
      title: 'Error!',
      text: `Ocurrio un error inesperado!`,
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

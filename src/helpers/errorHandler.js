import Swal from "sweetalert2";

export default function errorHandler(error) {
  if (error.response && error.response.status === 401) {
    Swal.fire({
      title: 'Error!',
      text: `Sesion inactiva`,
      icon: 'error',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      if (process.env.REACT_APP_ERROR_HANDLERS === 'true') {
        window.location.href = '/'
      }
    })
  } else {
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
import axios from "axios";

export const request = async (method, url, params, data) => {
  let token = localStorage.getItem('token');
  const origin = window.location.origin;

  const config = {
    method,
    url,
    params,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      Origin: origin,
    },
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // window.location.reload();
    }
    console.error(error);
    return error;
  }
};

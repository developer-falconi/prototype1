import axios from "axios";
export const request = async (method, url, params, data) => {

  let token = localStorage.getItem('token')

  const config = {
    method: method,
    url: url,
    params: params,
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error)
    return error;
  }
}

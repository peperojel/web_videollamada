import axios from 'axios'

const instance = axios.create({
  baseURL: "http://localhost:3333",
  headers : {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json'
  }
});

instance.interceptors.response.use((response) => {
  if (response.data) return response.data;
  return response
}, (error) => {
  return Promise.reject(error.response.data)
});

export default instance

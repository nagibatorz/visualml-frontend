import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://visualml-backend-production.up.railway.app/api'
    : '/api'
});

export { api };
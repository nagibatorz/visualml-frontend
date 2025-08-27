import axios from "axios";
export const api = axios.create({ baseURL: "/api" }); // Vite proxy sends to :8080

import axios from 'axios';

export const DEPLOYED_URL = "https://zosh-bazaar-mern.onrender.com";
// Production uses the established hosted API; localhost is development-only.
export const API_URL = (
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.DEV ? "http://localhost:8080" : DEPLOYED_URL)
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

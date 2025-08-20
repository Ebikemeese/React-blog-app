import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const BASE_URL = 'https://blogify-yt4f.onrender.com/api/v1/'
// export const BASE_URL = 'http://127.0.0.1:8000/api/v1/'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
})

//to get logged in user username(first_name)
const PUBLIC_ENDPOINTS = ["forgot-password", "login"];

api.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url.includes(endpoint)
    );

    if (isPublic) return config;

    const token = localStorage.getItem("access");
    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;

        if (expiry_date > current_time) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn("Token decoding failed:", err.message);
        localStorage.removeItem("access");
      }
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default api
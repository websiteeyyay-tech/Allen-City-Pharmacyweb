// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5272/api",
  withCredentials: false, // set true only if backend uses cookies for auth
  headers: { "Content-Type": "application/json" },
});

// Simple response interceptor to normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // normalize error shape
    const normalized = {
      message: err?.response?.data?.message ?? err?.message ?? "Unknown error",
      status: err?.response?.status,
      original: err,
    };
    return Promise.reject(normalized);
  }
);

export default api;

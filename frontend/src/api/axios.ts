// src/api/axios.ts
import axios, { AxiosError, AxiosResponse } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  original?: any;
}

// Base URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5272/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Ensure headers exist (Axios v1 expects AxiosRequestHeaders)
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = token ? `Bearer ${token}` : "";

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<any>) => {
    const normalized: ApiError = {
      message:
        (error.response?.data &&
          (error.response.data.message ?? JSON.stringify(error.response.data))) ||
        error.message ||
        "Unknown error",
      status: error.response?.status,
      original: error,
    };
    return Promise.reject(normalized);
  }
);

export default api;

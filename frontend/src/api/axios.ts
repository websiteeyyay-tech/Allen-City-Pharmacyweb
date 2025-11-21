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

    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      token ? `Bearer ${token}` : "";

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // This removes AxiosResponse type
  },
  (error: AxiosError<any>) => {
    return Promise.reject({
      message: error.response?.data?.message ?? error.message ?? "Unknown error",
      status: error.response?.status,
      original: error,
    });
  }
);

export default api;

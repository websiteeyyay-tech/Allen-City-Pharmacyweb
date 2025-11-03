import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5272/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((req) => {
  console.log("🟢 Request:", req.method?.toUpperCase(), req.url, req.data);
  return req;
});

api.interceptors.response.use(
  (res) => {
    console.log("✅ Response:", res.status, res.data);
    return res;
  },
  (error) => {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data);
    } else {
      console.error("🚫 Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

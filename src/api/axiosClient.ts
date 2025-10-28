import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5272/api", // ✅ must match your Swagger port
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Log all requests & responses
api.interceptors.request.use((request) => {
  console.log("🟢 Sending Request:", request.method?.toUpperCase(), request.url, request.data);
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
    return response;
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

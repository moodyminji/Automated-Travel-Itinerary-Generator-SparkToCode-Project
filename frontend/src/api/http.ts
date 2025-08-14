import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "http://localhost:8080",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Optional: normalize errors
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err?.message || "Network error. Please try again.";
    return Promise.reject(new Error(msg));
  },
);

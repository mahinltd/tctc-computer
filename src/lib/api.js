import axios from "axios";

// Use environment variable for API URL, with fallback
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.technicalcomputer.tech/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor: অটোমেটিক টোকেন যুক্ত করার জন্য
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
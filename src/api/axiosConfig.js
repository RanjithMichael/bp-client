import axios from "axios";

// Automatically choose base URL depending on environment
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-4.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ⏱️ prevent hanging requests
});

// Request Interceptor → Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → Handle global errors & token expiry
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized → redirect to login
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // Handle Render cold-start or temporary network errors → retry once
    if (
      (!error.response || error.code === "ECONNABORTED") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.warn("🔁 Retrying request due to timeout or network issue...");
      return API(originalRequest);
    }

    // Optional: Centralized error logging
    console.error("API Error:", {
      url: originalRequest?.url,
      message: error.message,
      status: error.response?.status,
    });

    return Promise.reject(error);
  }
);

// Helper for paginated GET requests
export const getPaginated = async (url, page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
  });
  const { data } = await API.get(`${url}?${params.toString()}`);
  return data;
};

export default API;














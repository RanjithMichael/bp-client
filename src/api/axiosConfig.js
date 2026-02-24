import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-11.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // increased for Render cold start
  withCredentials: true, // ✅ ensures cookies (refreshToken) are sent
});

// TOKEN REFRESH CONTROL
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response (server down / timeout)
    if (!error.response) {
      console.warn("Network/Server error:", error.message);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // ✅ Call refresh endpoint (POST, not GET)
          const { data } = await API.post("/auth/refresh", {}, { withCredentials: true });
          const newToken = data.data.accessToken;

          // Save new token
          localStorage.setItem("accessToken", newToken);

          // Update default header
          API.defaults.headers.common.Authorization = `Bearer ${newToken}`;

          isRefreshing = false;
          onRefreshed(newToken);
        } catch (refreshError) {
          isRefreshing = false;
          console.warn("Token refresh failed:", refreshError);

          if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            window.location.href = "/login"; // ✅ force redirect
          }

          return Promise.reject(refreshError);
        }
      }

      // Queue requests until refresh completes
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(API(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// GENERIC HELPERS
export const get = async (url, params = {}) => {
  const { data } = await API.get(url, { params });
  return data;
};

export const post = async (url, body) => {
  const { data } = await API.post(url, body);
  return data;
};

export const put = async (url, body) => {
  const { data } = await API.put(url, body);
  return data;
};

export const remove = async (url) => {
  const { data } = await API.delete(url);
  return data;
};

export default API;
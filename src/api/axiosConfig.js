import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-11.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
  withCredentials: true, // needed for refresh token (cookie)
});

//REFRESH CONTROL

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

//REQUEST INTERCEPTOR

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

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

    if (!error.response) {
      toast.warn(`Network error: ${error.message}`);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Prevent infinite loop for auth endpoints
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Handle 401 (expired or invalid token)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(API(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("🔄 Refreshing token...");
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        if (!newToken) throw new Error("No accessToken received");

        // Save token
        localStorage.setItem("token", newToken);

        // Update default headers
        API.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Retry queued requests
        onRefreshed(newToken);

        isRefreshing = false;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.warn("❌ Refresh failed:", refreshError);
        isRefreshing = false;
        refreshSubscribers = [];

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


//HELPER METHODS

export const get = async (url, config = {}) => {
  return await API.get(url, config);
};

export const post = (url, data, config = {}) =>
  API.post(url, data, config);

export const put = (url, data, config = {}) =>
  API.put(url, data, config);

export const remove = (url, config = {}) =>
  API.delete(url, config);

export default API;
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://bp-server-8.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // increased for Render cold start
  withCredentials: true,
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
    const token = localStorage.getItem("token");

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

    // Handle 401
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await API.post("/auth/refresh");

          const newToken = data.accessToken;

          // Save new token
          localStorage.setItem("token", newToken);

          // Update default header
          API.defaults.headers.common.Authorization =
            `Bearer ${newToken}`;

          isRefreshing = false;
          onRefreshed(newToken);
        } catch (refreshError) {
          isRefreshing = false;

          console.warn("Token refresh failed.");

          // Only clear if refresh explicitly invalid
          if (refreshError.response?.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }

          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;
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

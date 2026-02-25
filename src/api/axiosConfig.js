import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-11.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
  withCredentials: true, // ensures cookies (refreshToken) are sent
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

    if (!error.response) {
      console.warn("Network/Server error:", error.message);
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await API.post("/auth/refresh", {}, { withCredentials: true });
          const newToken = data?.data?.accessToken || data?.accessToken;

          if (!newToken) throw new Error("No accessToken in refresh response");

          localStorage.setItem("accessToken", newToken);
          API.defaults.headers.common.Authorization = `Bearer ${newToken}`;

          isRefreshing = false;
          onRefreshed(newToken);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          console.warn("Token refresh failed:", refreshError);

          if ([401, 403].includes(refreshError.response?.status)) {
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }

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
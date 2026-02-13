import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-8.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

// Prevent multiple refresh calls
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
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await API.post("/auth/refresh");
          const newToken = data.accessToken;

          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, token: newToken })
            );
          }

          API.defaults.headers.common.Authorization =
            `Bearer ${newToken}`;

          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(err);
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

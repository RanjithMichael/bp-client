import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-8.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true, // ✅ send cookies (refreshToken)
});

// Flag to avoid multiple refresh calls at once
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

    // Handle expired access token (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await API.post("/auth/refresh"); // backend refresh endpoint
          const newToken = data.accessToken;

          localStorage.setItem("token", newToken);
          API.defaults.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(API(originalRequest));
        });
      });
    }

    // Retry GET requests once on timeout/network issue
    if (
      (!error.response || error.code === "ECONNABORTED") &&
      !originalRequest._retry
    ) {
      if (originalRequest.method === "get") {
        originalRequest._retry = true;
        console.warn("🔁 Retrying GET request due to timeout or network issue...");
        return API(originalRequest);
      }
    }

    console.error("API Error:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

// Helpers
export const getPaginated = async (url, page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({ page, limit, ...(search && { search }) });
  const { data } = await API.get(`${url}?${params.toString()}`);
  return data;
};

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

export const upload = async (url, formData) => {
  const { data } = await API.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const toggleLike = async (postId) => {
  try {
    const { data } = await API.post(`/posts/${postId}/like`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to toggle like");
  }
};

export default API;
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://bp-server-11.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
  withCredentials: true,
});

//CONTROL FLAGS
let isRefreshing = false;
let refreshSubscribers = [];

//Notify queued requests
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

//REQUEST INTERCEPTOR
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

//RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.warn("Network error:", error.message);
      return Promise.reject(error);
    }

    //HANDLE 401
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      //If already refreshing → queue request
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

        const newToken = data?.accessToken;

        if (!newToken) throw new Error("No accessToken received");

        //Save token properly
        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("token", newToken); // fallback safety

        API.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        onRefreshed(newToken);
        isRefreshing = false;

        //Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.warn("❌ Refresh failed:", refreshError);

        isRefreshing = false;
        refreshSubscribers = [];

        //CLEAN LOGOUT
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

//HELPERS
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
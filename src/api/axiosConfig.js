import axios from "axios";

const API = axios.create({
  baseURL: "https://bp-server-4.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;












import axios from "axios";

const API = axios.create({
  baseURL: "https://bp-server-4.onrender.com/api", 
});

// Add JWT token to requests if logged in
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;




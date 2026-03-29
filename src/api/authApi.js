import API from "./axiosConfig";

// Register a new user
export const register = async (body) => {
  const { data } = await API.post("/auth/register", body);
  return data;
};

// Login
export const login = async (body) => {
  const { data } = await API.post("/auth/login", body);
  return data;
};

// Refresh access token
export const refresh = async () => {
  const { data } = await API.post("/auth/refresh", {}, { withCredentials: true });
  return data;
};

// Get current user profile
export const getProfile = async () => {
  const { data } = await API.get("/auth/profile");
  return data;
};

// Logout
export const logout = async () => {
  const { data } = await API.post("/auth/logout");
  return data;
};
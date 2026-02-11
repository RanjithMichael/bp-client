import axios from "axios";

const API_URL = "https://bp-server-8.onrender.com/api/auth/";

// ✅ Register
export const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData);
    return response.data; // { success, message, user, token }
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// ✅ Login
export const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData);
    return response.data; // { success, message, user, token }
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// ✅ Get Profile
export const getProfile = async (token) => {
  try {
    const response = await axios.get(API_URL + "profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { success, user }
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};
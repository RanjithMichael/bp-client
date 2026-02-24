import API from "../api/axiosConfig"; // ✅ import the shared Axios instance

// ✅ Register
export const register = async (userData) => {
  try {
    const { data } = await API.post("/auth/register", userData);
    return data; // { success, message, user, accessToken }
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// ✅ Login
export const login = async (userData) => {
  try {
    const { data } = await API.post("/auth/login", userData);
    // Store tokens and user info
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// ✅ Refresh Access Token
export const refreshToken = async () => {
  try {
    const { data } = await API.post("/auth/refresh", {}, { withCredentials: true });
    const newToken = data.data.accessToken;
    localStorage.setItem("accessToken", newToken);
    return newToken;
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// ✅ Get Profile
export const getProfile = async () => {
  try {
    const { data } = await API.get("/auth/profile");
    return data; // { success, user }
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  // Optionally call a backend logout route if you add one
};
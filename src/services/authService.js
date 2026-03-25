import API from "../api/axiosConfig";

// Register
export const register = async (userData) => {
  try {
    const { data } = await API.post("/auth/register", userData);

    return {
      success: data.success,
      token: data.accessToken,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// Login
export const login = async (userData) => {
  try {
    const { data } = await API.post("/auth/login", userData);

    // Store tokens and user info consistently
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    return {
      success: data.success,
      token: data.accessToken,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// Refresh Access Token
export const refreshToken = async () => {
  try {
    const { data } = await API.post("/auth/refresh", {}, { withCredentials: true });
    const newToken = data.accessToken; 
    localStorage.setItem("accessToken", newToken);

    return {
      success: data.success,
      token: newToken,
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// Get Profile
export const getProfile = async () => {
  try {
    const { data } = await API.get("/auth/profile");
    return {
      success: data.success,
      user: data.user, 
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
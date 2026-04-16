import API from "../api/axiosConfig";

//REGISTER
export const register = async (userData) => {
  try {
    const { data } = await API.post("/auth/register", userData);

    return {
      success: data.success,
      accessToken: data.accessToken, //FIXED
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

//LOGIN
export const login = async (userData) => {
  try {
    const { data } = await API.post("/auth/login", userData);

    //DO NOT store here (AuthContext will handle it)
    return {
      success: data.success,
      accessToken: data.accessToken, //FIXED
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

//REFRESH TOKEN
export const refreshToken = async () => {
  try {
    const { data } = await API.post(
      "/auth/refresh",
      {},
      { withCredentials: true }
    );

    return {
      success: data.success,
      accessToken: data.accessToken, //FIXED
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

//GET PROFILE
export const getProfile = async () => {
  try {
    const { data } = await API.get("/auth/profile");

    return {
      success: data.success,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

//LOGOUT
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  //SAFE PARSE USER
  
  const getStoredUser = () => {
    const item = localStorage.getItem("user");

    if (!item || item === "undefined" || item === "null") {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (err) {
      console.warn("Invalid user in localStorage, clearing...");
      localStorage.removeItem("user");
      return null;
    }
  };

  //STATE
  
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  //LOGOUT
  
  const logout = useCallback(() => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  delete API.defaults.headers.common.Authorization;

  setUser(null);

  window.location.href = "/login";
}, []);

  //REFRESH USER
  
  const refreshUser = useCallback(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const { data } = await API.get("/auth/profile");

    const userData = data?.user || data;

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  } catch (err) {
    toast.error(err?.response?.data?.message, "failed to refresh user");
    
  // if token invalid → logout cleanly
  if (err?.response?.status === 401) {
    logout();
  }
}
}, []);

  //INITIAL LOAD
  
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  refreshUser();
}, [refreshUser]);

  //LOGIN

const login = (userData, accessToken) => {
  if (!accessToken) {
    toast.error("No token received during login");
    return;
  }

  localStorage.setItem("accessToken", accessToken);

  localStorage.setItem("user", JSON.stringify(userData));

  API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  setUser(userData);
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
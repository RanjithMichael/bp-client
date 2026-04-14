import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";

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
    console.warn(
      "⚠️ Failed to refresh user:",
      err?.response?.data?.message
    );
  } finally {
    setLoading(false);
  }
}, []);

  //INITIAL LOAD
  
  useEffect(() => {
  refreshUser();
}, [refreshUser]);

  //LOGIN
  
  
const login = (userData, accessToken) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(userData));

  setUser(userData);

  API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
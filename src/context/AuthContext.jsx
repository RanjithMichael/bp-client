import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //Safe JSON parse
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

  //FIX: call function
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  //LOGOUT (clean everything)
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token"); // fallback cleanup

    setUser(null);

    delete API.defaults.headers.common.Authorization;
  }, []);

  //REFRESH USER (safe version)
  const refreshUser = useCallback(async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // attach token
      API.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { data } = await API.get("/auth/profile");

      //ensure correct format
      const userData = data?.user || data;

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.warn("⚠️ Failed to refresh user:", err?.response?.data?.message);

      //DON'T logout immediately
      // Let axios interceptor handle token expiry
    } finally {
      setLoading(false);
    }
  }, []);

  //INITIAL LOAD
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  //LOGIN
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token); // fallback safety

    setUser(userData);

    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");

    delete API.defaults.headers.common.Authorization;

    setUser(null);

    window.location.href = "/login";
  }, []);

  //REFRESH USER
  
  const refreshUser = useCallback(async () => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // attach token
      API.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { data } = await API.get("/auth/profile");

      const userData = data?.user || data;

      // store clean user (NO token inside user)
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.warn(
        "⚠️ Failed to refresh user:",
        err?.response?.data?.message
      );

      // axios interceptor will handle logout on 401
    } finally {
      setLoading(false);
    }
  }, []);

  //INITIAL LOAD
  
  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    refreshUser();
  }, [refreshUser]);

  //LOGIN
  
  const login = (userData, accessToken) => {
    // store token separately (IMPORTANT)
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken); // fallback

    // store user separately
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
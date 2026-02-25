import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Safe JSON parse for localStorage
  const getStoredUser = () => {
    try {
      const item = localStorage.getItem("user");
      if (!item || item === "undefined") return null;
      return JSON.parse(item);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    delete API.defaults.headers.common.Authorization;
  };

  // REFRESH USER FROM BACKEND
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      logout();
      setLoading(false);
      return;
    }

    try {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
      const { data } = await API.get("/auth/profile");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // INITIAL LOAD
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // LOGIN
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    setUser(userData);
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
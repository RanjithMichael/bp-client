import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh user from backend using token
  const refreshUser = useCallback(async (token) => {
    if (!token) {
      logout();
      return;
    }

    try {
      const { data } = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const freshUser = data.user || data;
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      logout();
    }
  }, []);

  // Initial load: check localStorage for user + token
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (token) {
      refreshUser(token); // validate token with backend
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
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
    <AuthContext.Provider
      value={{ user, login, logout, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Refresh user from backend
  const refreshUser = useCallback(async (token) => {
    if (!token) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const freshUser = {
        ...(data.user || data),
        token,
      };

      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.token) {
      refreshUser(storedUser.token);
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = (userData, token) => {
    const userWithToken = { ...userData, token };

    localStorage.setItem("user", JSON.stringify(userWithToken));
    setUser(userWithToken);
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


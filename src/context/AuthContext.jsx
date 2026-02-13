import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(true);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // REFRESH USER FROM BACKEND
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const data = await API.get("/auth/me");

      localStorage.setItem("user", JSON.stringify(data.user || data));
      setUser(data.user || data);
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
    localStorage.setItem("token", token);
    setUser(userData);
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

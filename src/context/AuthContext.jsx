import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // SAFE PARSE
  const getStoredUser = () => {
    const item = localStorage.getItem("user");

    if (!item || item === "undefined" || item === "null") {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (err) {
      localStorage.removeItem("user");
      return null;
    }
  };

  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // LOGOUT FIXED
  const logout = useCallback(async () => {
  try {
    await API.post("/auth/logout"); // backend clears refresh cookie
  } catch (err) {
    console.error("Logout error:", err);
    toast.error("Logout failed, please try again.")
  }

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  delete API.defaults.headers.common["Authorization"];

  setUser(null);

  // Use navigate if available, else fallback
  window.location.href = "/login";
}, []);


  // REFRESH USER FIXED
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
      toast.error(err?.response?.data?.message || "Failed to refresh user");

      if (err?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      refreshUser();
    } else {
      delete API.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [refreshUser]);

  const login = (userData, token) => {
    if (!token) {
      console.error("Login failed: Access token is missing.");
      toast.error("Authentication failed: No token received");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    API.defaults.headers.common.Authorization = `Bearer ${token}`;

    setUser(userData);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

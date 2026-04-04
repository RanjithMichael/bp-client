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

  //Initialize state
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  //LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("user");

    setUser(null);

    delete API.defaults.headers.common.Authorization;

    // optional redirect
    window.location.href = "/login";
  }, []);

  //REFRESH USER (keeps token intact)
  const refreshUser = useCallback(async () => {
    const storedUser = getStoredUser();
    const token = storedUser?.token;

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // attach token
      API.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { data } = await API.get("/auth/profile");

      const userData = data?.user || data;

      //preserve token
      const updatedUser = {
        ...userData,
        token,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.warn("⚠️ Failed to refresh user:", err?.response?.data?.message);
      //axios interceptor will handle 401
    } finally {
      setLoading(false);
    }
  }, []);

  //INITIAL LOAD
  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser?.token) {
      API.defaults.headers.common.Authorization = `Bearer ${storedUser.token}`;
    }

    refreshUser();
  }, [refreshUser]);

  //LOGIN
  const login = (userData, token) => {
    const fullUser = {
      ...userData,
      token,
    };

    localStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);

    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreatePostClick = () => {
    if (user) {
      navigate("/create-post");
    } else {
      toast.warn("⚠️ You must log in or register to create a post.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-wide"
        >
          BlogPlatform
        </NavLink>

        {/* Navigation */}
        <nav className="flex items-center gap-4">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Home
          </NavLink>

          {/* CONDITIONAL UI */}
          {user ? (
            <>
              {/* Create Post */}
              <button
                onClick={handleCreatePostClick}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition text-sm font-medium"
              >
                Create Post
              </button>

              {/* Profile */}
              <NavLink
                to="/profile"
                className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                👤 {user.name || user.username || "Profile"}
              </NavLink>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <NavLink
                to="/login"
                className="border border-gray-300 px-4 py-1.5 rounded-full text-sm hover:bg-gray-100 transition"
              >
                Login
              </NavLink>

              {/* Register */}
              <NavLink
                to="/register"
                className="bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition text-sm"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
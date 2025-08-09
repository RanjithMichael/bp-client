import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Create Post", path: "/create-post" },
    { name: "Subscriptions", path: "/subscriptions" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Blogify
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-700 hover:text-indigo-600"
              }
            >
              {link.name}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="text-gray-700 hover:text-indigo-600"
              >
                {user.name}
              </NavLink>
              <button
                onClick={onLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="text-gray-700 hover:text-indigo-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {user.name}
                </NavLink>
                <button
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

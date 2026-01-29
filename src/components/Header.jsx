import { Link, useNavigate } from "react-router-dom";
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
      toast.warn("⚠️ You must register or log in to create a post.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-md">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold">
          BlogPlatform
        </Link>
      </div>

      <nav className="flex flex-col md:flex-row gap-4 mt-2 md:mt-0 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <button
          onClick={handleCreatePostClick}
          className="hover:underline focus:outline-none"
        >
          Create Post
        </button>

        {user ? (
          <>
            <Link to="/profile" className="hover:underline font-medium">
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-white font-medium transition"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
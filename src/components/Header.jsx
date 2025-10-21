import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");

  const handleCreatePostClick = () => {
    if (user) {
      navigate("/create-post");
    } else {
      setLoginMessage("⚠️ You must log in to create a post.");
      setTimeout(() => setLoginMessage(""), 3000); // hide after 3 seconds
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex flex-col md:flex-row justify-between items-center relative shadow-md">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold">
          BlogPlatform
        </Link>

        {/* Login warning message */}
        {loginMessage && (
          <div className="absolute top-full mt-2 right-0 bg-yellow-100 text-yellow-800 p-2 rounded shadow-md text-sm z-50">
            {loginMessage}
          </div>
        )}
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
            <Link
              to="/profile"
              className="hover:underline font-medium"
            >
              {user.name}
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;



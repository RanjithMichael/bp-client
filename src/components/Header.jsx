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
    <header className="bg-blue-600 text-white p-4 flex flex-col md:flex-row justify-between items-center relative">
      <div className="flex justify-between w-full md:w-auto items-center">
        <Link to="/" className="text-xl font-bold">BlogPlatform</Link>

        {/* Login warning message */}
        {loginMessage && (
          <div className="absolute top-full mt-2 right-0 bg-yellow-100 text-yellow-800 p-2 rounded shadow-md text-sm">
            {loginMessage}
          </div>
        )}
      </div>

      <nav className="flex gap-4 mt-2 md:mt-0">
        <Link to="/">Home</Link>
        <button onClick={handleCreatePostClick} className="hover:underline">
          Create Post
        </button>

        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            <button onClick={logout} className="bg-red-500 px-2 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;


import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">BlogPlatform</Link>
      <nav className="flex gap-4">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/create-post">Create Post</Link>
            <Link to="/profile">{user.name}</Link>
            <button onClick={logout} className="bg-red-500 px-2 rounded">Logout</button>
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

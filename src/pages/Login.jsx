import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../services/authService"; // ✅ import from authService

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Use authService instead of raw Axios
      const data = await loginService(form);

      if (data.success) {
        console.log("Login success:", data.message);
        localStorage.setItem("token", data.token);

        // Update context
        login(data.user);

        // Navigate to dashboard or home
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/london-eye-england.webp')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          aria-label="Email address"
          className="border p-3 rounded w-full mb-3 shadow-sm focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          aria-label="Password"
          className="border p-3 rounded w-full mb-5 shadow-sm focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          disabled={loading}
          aria-label="Login"
          className="bg-blue-600 text-white font-semibold p-3 rounded w-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
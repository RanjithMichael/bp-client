import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register as registerService } from "../services/authService"; // ✅ import service

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Use authService instead of raw Axios
      const data = await registerService(form);

      if (data.success) {
        console.log("Registration success:", data.message);
        localStorage.setItem("token", data.token);

        // Update context
        login(data.user);

        // Navigate to dashboard or home
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/images.jfif')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          aria-label="Full Name"
          className="border p-3 rounded w-full mb-3 shadow-sm focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          aria-label="Email"
          className="border p-3 rounded w-full mb-3 shadow-sm focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          aria-label="Password"
          className="border p-3 rounded w-full mb-5 shadow-sm focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          disabled={loading}
          aria-label="Register"
          className="bg-blue-600 text-white font-semibold p-3 rounded w-full hover:bg-blue-700 transition disabled:opacity-70 flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
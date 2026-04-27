import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register as registerService } from "../services/authService";
import { toast } from "react-toastify";

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
    const data = await registerService(form);

    if (data.success) {
      toast.success(data.message || "Registration successful");

      const token = data.accessToken; 
      
      if (token) {
        localStorage.setItem("token", token);
        login(data.user, token); 
      }

      navigate("/dashboard");
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account 🚀
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Join and start sharing your ideas
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">
            {error}
          </p>
        )}

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          className="w-full px-4 py-3 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className="w-full px-4 py-3 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          className="w-full px-4 py-3 mb-5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition disabled:opacity-70 flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
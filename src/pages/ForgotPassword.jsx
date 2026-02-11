import { useState } from "react";
import API from "../api/axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "If this email is registered, a reset link has been sent.");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Submit forgot password request"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
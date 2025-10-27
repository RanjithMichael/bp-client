import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.put(`/auth/reset-password/${token}`, { password });
      setMessage("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;

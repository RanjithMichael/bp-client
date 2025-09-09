import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Login to create post");
    try {
      await API.post("/posts", form);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Create Post</h2>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} className="border p-2 rounded w-full"/>
        <textarea name="content" placeholder="Content" onChange={handleChange} className="border p-2 rounded w-full h-64"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-32">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;

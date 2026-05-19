import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    API.get(`/posts/${id}`).then(res => setFormData(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/posts/${id}`, formData);  
    navigate(`/post/${formData.slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Title"
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Content"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Update Post
      </button>
    </form>
  );
};

export default EditPost;


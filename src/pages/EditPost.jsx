import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

const EditPost = () => {
  const { slug } = useParams();   //use slug from route
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
  if (slug) {
    API.get(`/posts/slug/${slug}`).then(res => {
      const post = res.data.post; // ✅ adjust based on backend response
      setFormData({
        title: post.title || "",
        content: post.content || ""
      });
    });
  }
}, [slug]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.put(`/posts/slug/${slug}`, formData);
    //use the slug from backend response
    navigate(`/post/${data.post.slug}`);
  } catch (err) {
    console.error("Update failed", err);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={formData.title || ""}   //avoid undefined
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Title"
      />
      <textarea
        name="content"
        value={formData.content || ""}  //avoid undefined
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

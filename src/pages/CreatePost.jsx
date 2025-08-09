import { useState } from "react";
import PostForm from "../components/PostForm";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await api.post("/posts", data);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}

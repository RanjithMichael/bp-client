import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import api from "../utils/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await api.put(`/posts/${id}`, data);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
}

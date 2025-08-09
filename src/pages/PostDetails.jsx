import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import CommentSection from "../components/CommentSection";
import SubscriptionButton from "../components/SubscriptionButton";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [id]);

  const handleAddComment = async (text) => {
    try {
      const res = await api.post(`/posts/${id}/comments`, { text });
      setComments([...comments, res.data]);
    } catch (error) {
      console.error(error);
    }
  };

  if (!post) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">
        By {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="prose max-w-none mb-6">{post.content}</div>

      <SubscriptionButton
        isSubscribed={isSubscribed}
        onToggle={() => setIsSubscribed(!isSubscribed)}
      />

      <CommentSection comments={comments} onAddComment={handleAddComment} />
    </div>
  );
}

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import Comment from "../components/Comment";
import { AuthContext } from "../context/AuthContext";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("❌ Error fetching post:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleComment = async () => {
    if (!user) return alert("⚠️ Please log in to comment");
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/posts/${id}/comments`, { text: commentText });
      setPost((prev) => ({ ...prev, comments: res.data }));
      setCommentText("");
    } catch (err) {
      console.error("❌ Error posting comment:", err);
      alert("Failed to add comment. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="animate-pulse text-gray-600">⏳ Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Post Title */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-6 leading-relaxed">{post.content}</p>

      {/* Comments Section */}
      <h2 className="text-xl font-semibold mb-3">💬 Comments</h2>
      <div className="space-y-3 mb-6">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        )}
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300 resize-none"
            rows="3"
          />
          <button
            onClick={handleComment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg w-32 transition"
          >
            Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-500 italic">🔑 Please log in to post a comment.</p>
      )}
    </div>
  );
};

export default PostDetails;

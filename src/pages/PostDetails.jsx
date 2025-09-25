
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
        setLikes(data.likes || 0);
        setShares(data.shares || 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        if (err.response?.status === 401) {
          setError("You are not authorized to view this post.");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError("Post not found.");
        } else {
          setError("Failed to fetch post. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this post.");
      return;
    }
    try {
      const { data } = await API.post(
        `/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setLikes(data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
      if (err.response?.status === 401) {
        alert("You are not authorized. Please login.");
        navigate("/login");
      }
    }
  };

  const handleShare = async () => {
    if (!user) {
      alert("Please login to share this post.");
      return;
    }
    try {
      const { data } = await API.post(
        `/posts/${id}/share`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setShares(data.shares);
      navigator.clipboard.writeText(window.location.href);
      alert("Post link copied! Share it anywhere.");
    } catch (err) {
      console.error("Error sharing post:", err);
      if (err.response?.status === 401) {
        alert("You are not authorized. Please login.");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="ml-4 text-gray-200 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6">
      {/* Post Title */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* Author + Date */}
      <p className="text-gray-600 mb-4">
        By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Post Content */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Subscribe Button */}
      {user && (
        <div className="mt-4">
          <SubscribeButton authorId={post.author?._id} category={post.category} />
        </div>
      )}

      {/* Like & Share Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleLike}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          👍 Like ({likes})
        </button>
        <button
          onClick={handleShare}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🔗 Share ({shares})
        </button>
      </div>

      {/* Analytics Chart */}
      <div className="mt-8">
        <AnalyticsChart />
      </div>
    </div>
  );
};

export default PostDetails;

import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";

const PostDetails = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await API.get(`/posts/slug/${slug}`);
        setPost(data);
        setLikes(data.analytics?.likes || 0);
        setShares(data.analytics?.shares || 0);
      } catch (err) {
        console.error("Error fetching post:", err);
        if (err.response?.status === 404) {
          setError("Post not found.");
        } else {
          setError("Failed to fetch post. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  // 👍 Handle Like
  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this post.");
      return;
    }

    try {
      const { data } = await API.post(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
      alert(err.response?.data?.message || "Failed to like post.");
    }
  };

  // 👎 Handle Unlike
  const handleUnlike = async () => {
    if (!user) {
      alert("Please login to unlike this post.");
      return;
    }

    try {
      const { data } = await API.delete(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      console.error("Error unliking post:", err);
      alert(err.response?.data?.message || "Failed to unlike post.");
    }
  };

  // 🔗 Handle Share
  const handleShare = async () => {
    if (!user) {
      alert("Please login to share this post.");
      return;
    }

    try {
      const { data } = await API.post(`/posts/${post._id}/share`);
      setShares(data.shares);

      // Copy post URL to clipboard
      await navigator.clipboard.writeText(data.shareUrl || `${window.location.origin}/post/${post.slug}`);
      alert("✅ Post link copied to clipboard!");
    } catch (err) {
      console.error("Error sharing post:", err);
      alert(err.response?.data?.message || "Failed to share post.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-700 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4 pb-10">
      {/* 📝 Title */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* 👤 Author & Date */}
      <p className="text-gray-600 mb-4">
        By{" "}
        <Link
          to={`/author/${post.author?._id}`}
          className="text-blue-500 hover:underline"
        >
          {post.author?.name || "Unknown Author"}
        </Link>{" "}
        • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* 📄 Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 🔔 Subscribe Button */}
      {user && (
        <div className="mt-4">
          <SubscribeButton authorId={post.author?._id} category={post.category} />
        </div>
      )}

      {/* 👍 Like & 🔗 Share */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={likes > 0 ? handleUnlike : handleLike}
          className={`px-4 py-2 rounded ${likes > 0 ? "bg-gray-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          👍 {likes > 0 ? "Unlike" : "Like"} ({likes})
        </button>
        <button
          onClick={handleShare}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🔗 Share ({shares})
        </button>
      </div>

      {/* 📊 Analytics Chart */}
      <div className="mt-8">
        <AnalyticsChart postId={post._id} />
      </div>
    </div>
  );
};

export default PostDetails;

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
  const [likedByUser, setLikedByUser] = useState(false);
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
        // Check if current user has liked this post
        setLikedByUser(data.likedByCurrentUser || false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(
          err.response?.status === 404
            ? "Post not found or may have been removed."
            : "Failed to load the post. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  // Toggle Like/Unlike
  const toggleLike = async () => {
    if (!user) return alert("Please login to like this post.");
    try {
      let data;
      if (likedByUser) {
        ({ data } = await API.delete(`/posts/${post._id}/like`));
      } else {
        ({ data } = await API.post(`/posts/${post._id}/like`));
      }

      setLikes(data.likes);
      setLikedByUser(!likedByUser);
    } catch (err) {
      console.error("Error updating like:", err);
      alert(err.response?.data?.message || "Failed to update like.");
    }
  };

  // Share handler
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${post.slug}`;
      await navigator.clipboard.writeText(shareUrl);
      const { data } = await API.post(`/posts/${post._id}/share`);
      setShares(data.shares);
      alert("✅ Post link copied!");
    } catch (err) {
      console.error("Error sharing post:", err);
      alert(err.response?.data?.message || "Failed to share post.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-700 text-lg">Loading post...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  const imageUrl = post?.image
    ? post.image.startsWith("http")
      ? post.image
      : `https://bp-server-4.onrender.com/${post.image.replace(/\\/g, "/")}`
    : "/default-post.png";

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4 pb-10">
      {/* Post Image */}
      <div className="mb-6">
        <img
          src={imageUrl}
          alt={post?.title || "Post image"}
          className="w-full h-64 object-cover rounded-lg shadow-md"
          onError={(e) => (e.target.src = "/default-post.png")}
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{post?.title}</h1>

      {/* Author & Date */}
      <p className="text-gray-600 mb-4">
        By{" "}
        <Link
          to={`/author/${post?.author?.username || post?.author?._id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {post?.author?.name || "Unknown Author"}
        </Link>{" "}
        • {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
      </p>

      {/* Content */}
      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      />

      {/* Subscribe */}
      {user && (
        <div className="mt-4">
          <SubscribeButton authorId={post?.author?._id} category={post?.category} />
        </div>
      )}

      {/* Like & Share */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={toggleLike}
          className={`px-4 py-2 rounded transition ${
            likedByUser
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          👍 {likedByUser ? "Unlike" : "Like"} ({likes})
        </button>
        <button
          onClick={handleShare}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          🔗 Share ({shares})
        </button>
      </div>

      {/* Analytics */}
      <div className="mt-8">
        <AnalyticsChart postId={post?._id} />
      </div>
    </div>
  );
};

export default PostDetails;





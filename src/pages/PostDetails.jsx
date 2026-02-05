import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

const PostDetails = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await API.get(`/posts/slug/${slug}`);
        const fetchedPost = data.post;

        setPost(fetchedPost);
        setLikes(fetchedPost.likes?.length || 0);
        setShares(fetchedPost.shares || 0);
        setComments(fetchedPost.comments || []);

        if (user) {
          setLikedByUser(
            fetchedPost.likes?.some((id) => id.toString() === user._id) || false
          );
        }
      } catch (err) {
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
  }, [slug, user]);

  const toggleLike = async () => {
    if (!user) {
      toast.info("Please login to like this post.");
      return;
    }

    try {
      setLiking(true);
      const { data } = await API.patch(`/posts/${post._id}/like`);
      setLikes(data.likesCount);
      setLikedByUser(data.liked);
      toast.success(data.liked ? "👍 Post liked!" : "👎 Like removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update like.");
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${post.slug}`;
      await navigator.clipboard.writeText(shareUrl);
      setShares((prev) => prev + 1);
      toast.info("🔗 Post link copied to clipboard!");
    } catch {
      toast.error("Failed to share post.");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;

    if (!text.trim()) return;

    try {
      const { data } = await API.post(`/posts/${post._id}/comments`, { text });
      setComments(data.post.comments || []);
      e.target.reset();
      toast.success("💬 Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment.");
    }
  };

  const deleteComment = async (id) => {
    try {
      await API.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success("🗑️ Comment deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4" />
        <p className="text-gray-700 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://bp-server-8.onrender.com/api";

  const imageUrl = post?.image
    ? post.image.startsWith("http")
      ? post.image
      : `${BASE_URL.replace("/api", "")}/${post.image.replace(/\\/g, "/")}`
    : "/default-post.png";

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4 pb-10">
      {/* Post Image */}
      <img
        src={imageUrl}
        alt={post?.title}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
        onError={(e) => (e.target.src = "/default-post.png")}
      />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{post?.title}</h1>

      {/* Author */}
      <p className="text-gray-600 mb-4">
        By{" "}
        <Link
          to={`/author/${post?.author?.username}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {post?.author?.name || "Unknown Author"}
        </Link>{" "}
        • {post?.createdAt && new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Content */}
      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      />

      {/* Subscribe */}
      {user && (
        <div className="mt-4">
          <SubscribeButton
            authorId={post?.author?._id}
            category={post?.category}
          />
        </div>
      )}

      {/* Like & Share */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={toggleLike}
          disabled={liking}
          className={`px-4 py-2 rounded text-white transition ${
            likedByUser
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          👍 {likedByUser ? "Unlike" : "Like"} ({likes})
        </button>

        <button
          onClick={handleShare}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🔗 Share ({shares})
        </button>
      </div>

      {/* Analytics */}
      <div className="mt-8">
        <AnalyticsChart postId={post?._id} />
      </div>

      {/* Comments */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {user ? (
          <form onSubmit={addComment} className="flex gap-2 mb-6">
            <input
              name="comment"
              type="text"
              placeholder="Write a comment..."
              className="flex-grow border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Post
            </button>
          </form>
        ) : (
          <p className="text-gray-600">Login to add a comment.</p>
        )}

        {comments.filter((c) => !c.isDeleted).length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-4">
            {comments
              .filter((c) => !c.isDeleted)
              .map((c) => (
                <li
                  key={c._id}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <FaUserCircle className="text-gray-400 text-2xl" />
                  <div className="flex-grow">
                    <p className="text-gray-800">{c.text}</p>
                                        <span className="text-sm text-gray-500">
                      by {c.user?.name || "Unknown"} •{" "}
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    {user &&
                      (user._id === c.user?._id || user.isAdmin) && (
                        <button
                          onClick={() => deleteComment(c._id)}
                          className="ml-4 text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
                     
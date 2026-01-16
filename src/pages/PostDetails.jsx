import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";

// ✅ Toastify
import { toast } from "react-toastify";

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

  // Fetch post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await API.get(`/posts/slug/${slug}`);
        const fetchedPost = data.post;
        setPost(fetchedPost);

        setLikes(fetchedPost.analytics?.likes?.length || 0);
        setShares(fetchedPost.analytics?.shares || 0);

        if (user) {
          const userId = user._id;
          setLikedByUser(
            fetchedPost.analytics?.likes?.some((id) => id.toString() === userId) || false
          );
        }

        // ✅ Fetch comments
        const commentsRes = await API.get(`/comments/${fetchedPost._id}`);
        setComments(commentsRes.data.comments || []);
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
  }, [slug, user]);

  // Toggle Like/Unlike
  const toggleLike = async () => {
    if (!user) {
      toast.info("Please login to like this post.");
      return;
    }
    try {
      const { data } = await API.put(`/posts/${post._id}/like`);
      setLikes(data.analytics.likes);
      setLikedByUser(data.liked);
      toast.success(data.liked ? "👍 Post liked!" : "👎 Like removed.");
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error(err.response?.data?.message || "Failed to update like.");
    }
  };

  // Share handler
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${post.slug}`;
      await navigator.clipboard.writeText(shareUrl);
      setShares((prev) => prev + 1);
      toast.info("🔗 Post link copied to clipboard!");
    } catch (err) {
      console.error("Error sharing post:", err);
      toast.error("Failed to share post.");
    }
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    if (!text.trim()) return;

    try {
      const { data } = await API.post(`/comments/${post._id}`, { text });
      setComments([data.comment, ...comments]); // prepend new comment
      e.target.reset();
      toast.success("💬 Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error(err.response?.data?.message || "Failed to add comment.");
    }
  };

  // Delete comment (soft delete)
  const deleteComment = async (id) => {
    try {
      await API.delete(`/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
      toast.success("🗑️ Comment deleted.");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error(err.response?.data?.message || "Failed to delete comment.");
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
          to={`/author/${post?.author?._id}`}
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

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {user ? (
          <form onSubmit={addComment} className="flex gap-2 mb-6">
            <input
              name="comment"
              type="text"
              placeholder="Write a comment..."
              className="flex-grow border rounded px-3 py-2"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Post
            </button>
          </form>
        ) : (
          <p className="text-gray-600">Login to add a comment.</p>
        )}

        <ul className="space-y-4">
          {comments.filter((c) => !c.isDeleted).map((c) => (
            <li key={c._id} className="border-b pb-2">
              <p className="text-gray-800">{c.text}</p>
              <span className="text-sm text-gray-500">
                by {c.user?.name || "Unknown"} •{" "}
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
              {user && (user._id === c.user?._id || user.isAdmin) && (
                <button
                  onClick={() => deleteComment(c._id)}
                  className="ml-4 text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostDetails;
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";
import { toast } from "react-toastify";

const PostDetails = () => {
  const { slug } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState(false);

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://bp-server-11.onrender.com/api";

  // Fetch post
  useEffect(() => {
    if (!slug || authLoading) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await API.get(`/posts/slug/${slug}`);
        const fetchedPost = data?.post;

        if (!fetchedPost) {
          setError("Post not found.");
          setLoading(false);
          return;
        }

        setPost(fetchedPost);
        setLikes(fetchedPost.likes?.length || 0);
        setShares(fetchedPost.shares || 0);
        setComments(fetchedPost.comments || []);
        setLikedByUser(user ? fetchedPost.likes?.includes(user._id) : false);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.status === 404
            ? "Post not found or may have been removed."
            : "Failed to load the post. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, user, authLoading]);

  // Like/unlike
  const toggleLike = async () => {
    if (!user || !post) {
      toast.info("Please login to like this post.");
      return;
    }

    try {
      setLiking(true);
      const { data } = await API.put(`/posts/${post._id}/like`);
      setLikes(data.data?.likes?.length || likes);
      setLikedByUser(data.data?.likes?.includes(user._id));
      toast.success(
        data.data?.likes?.includes(user._id)
          ? "👍 Post liked!"
          : "👎 Like removed."
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update like.");
    } finally {
      setLiking(false);
    }
  };

  // Share
  const handleShare = async () => {
    if (!post) return;
    try {
      const shareUrl = `${window.location.origin}/post/${post.slug}`;
      await navigator.clipboard.writeText(shareUrl);
      setShares((prev) => prev + 1);
      toast.info("🔗 Post link copied to clipboard!");
    } catch {
      toast.error("Failed to share post.");
    }
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment?.value;
    if (!text?.trim() || !post) return;

    try {
      const { data } = await API.post(`/posts/${post._id}/comments`, { text });
      setComments(data.post?.comments || []);
      e.target.reset();
      toast.success("💬 Comment added!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add comment.");
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    if (!user || !post) {
      toast.info("Please login to delete comments.");
      return;
    }

    try {
      await API.delete(`/posts/${post._id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("🗑️ Comment deleted!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading post...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  const imageUrl = post?.image
    ? post.image.startsWith("http")
      ? post.image
      : `${BASE_URL.replace("/api", "")}/${post.image.replace(/\\/g, "/")}`
    : "/default-post.png";

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4 pb-10">
      <img
        src={imageUrl}
        alt={post?.title}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
        onError={(e) => (e.target.src = "/default-post.png")}
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-900">{post?.title}</h1>

      <p className="text-gray-600 mb-4">
        By{" "}
        <Link
          to={`/author/${post?.author?.username}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {post?.author?.name || "Unknown Author"}
        </Link>{" "}
        • {new Date(post?.createdAt).toLocaleDateString()}
      </p>

      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      />

      {user && (
        <div className="mt-4">
          <SubscribeButton
            authorId={post?.author?._id}
            category={post?.category}
          />
        </div>
      )}

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={toggleLike}
          disabled={liking}
          className={`px-4 py-2 rounded text-white ${
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
      {post?._id && <AnalyticsChart postId={post._id} />}

      {/* Comments Section */}
      <form onSubmit={addComment} className="mt-6">
        <textarea
          name="comment"
          placeholder="Write a comment..."
          className="w-full border rounded p-2 mb-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💬 Add Comment
        </button>
      </form>

      <div className="mt-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="border-b py-2 text-gray-700 flex justify-between items-center"
          >
            <span>
              <strong>{c.author?.name || "Anonymous"}:</strong> {c.text}
            </span>
            {user && user._id === c.author?._id && (
              <button
                onClick={() => deleteComment(c._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
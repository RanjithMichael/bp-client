import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";
import { toast } from "react-toastify";

// Map of category-specific fallback images
const categoryFallback = {
  "data scientist": "https://res.cloudinary.com/djle175hb/image/upload/v1778841309/0_gMvS7ZBIoCX8-Mqe_emfljf.jpg",
  "business analyst": "https://res.cloudinary.com/djle175hb/image/upload/v1778841394/https_3A_2F_2Fwww.hbs.edu_2Fctfassets_2Fpublic_2Fimages_2F5zdIhFfQlGehyJLZCR11FB_2FBA_2520Image_sopvyb.webp",
  "computer coding": "https://res.cloudinary.com/djle175hb/image/upload/v1778841533/7200_myugxi.jpg",
  "machine learning": "https://res.cloudinary.com/djle175hb/image/upload/v1778841707/what-is-machine-learning-1024x683_vbjhb6.png",
  "artificial intelligence": "https://res.cloudinary.com/djle175hb/image/upload/v1778841815/where-is-ai-used_vbmbey.jpg",
  "html & css":"https://res.cloudinary.com/djle175hb/image/upload/v1778841882/1_lJ32Bl-lHWmNMUSiSq17gQ_erfbwd.png",
  "web development":"https://res.cloudinary.com/djle175hb/image/upload/v1778842008/1_V-Jp13LvtVc2IiY2fp4qYw_n6djkw.jpg",
  "mobile app development":"https://res.cloudinary.com/djle175hb/image/upload/v1778842101/7115055_1997_2_ldotl5.jpg",
  "cybersecurity":"https://res.cloudinary.com/djle175hb/image/upload/v1778842174/Cybersecurity_certiprof_t8uqpa.jpg",
  "generic": "https://res.cloudinary.com/djle175hb/image/upload/v1778771435/DALL_C2_B7E-2025-02-11-18.59.04-A-modern-and-professional-illustration-depicting-a-computer-programmer-working-on-code.-The-image-should-feature-a-clean-workspace-with-a-laptop-displ_vkl7n2.webp"
};

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
        const fetchedPost = data.post;

        if (!fetchedPost) {
          setError("Post not found.");
          return;
        }

        setPost(fetchedPost);
        setLikes(fetchedPost.likesCount ?? fetchedPost.likes?.length ?? 0);
        setShares(fetchedPost.sharesCount ?? fetchedPost.shares ?? 0);
        setComments(fetchedPost.comments || []);
        setLikedByUser(user ? fetchedPost.likes?.includes(user._id) : false);
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Failed to load the post. Please try again later."
        );
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

      const { data } = await API.put(
        `/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );

      setLikes(data.likesCount);
      setLikedByUser(data.liked);

      toast.success(data.liked ? "👍 Post liked!" : "👎 Like removed.");
    } catch (err) {
      console.error("LIKE ERROR:", err);
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
      const updatedPost = data.post;

      setComments(updatedPost.comments || []);
      e.target.reset();
      toast.success("💬 Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment.");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.info("Please login to delete comments.");
      return;
    }

    if (!commentId) {
      toast.error("Invalid comment ID");
      return;
    }

    try {
      const { data } = await API.delete(`/comments/${commentId}`);

      if (data?.success) {
        if (data?.post?.comments) {
          setComments(data.post.comments);
        } else {
          setComments((prev) => prev.filter((c) => c._id !== commentId));
        }

        toast.success(data.message || "🗑️ Comment deleted!");
      } else {
        toast.error(data?.message || "Failed to delete comment.");
      }
    } catch (err) {
      console.error("Delete comment error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete comment.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  // ✅ Use backend coverImage with category fallback
  const primaryCategory = post?.categories?.[0]?.toLowerCase();
  const imageUrl =
    post?.coverImage ||
    categoryFallback[primaryCategory] ||
    categoryFallback.generic;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4 pb-10">
      <img
        src={imageUrl}
        alt={post?.title}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
        onError={(e) => (e.target.src = categoryFallback.generic)}
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

      {user && post?.author?._id && (
        <div className="mt-4">
          <SubscribeButton authorId={post.author._id} />
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
        {comments.filter((c) => !c.isDeleted).map((c) => (
                    <div
            key={c._id}
            className="border-b py-2 text-gray-700 flex justify-between items-center"
          >
            <span>
              <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}
            </span>
            {user && (user._id === c.user?._id || user.role === "admin") && (
              <button
                onClick={() => handleDeleteComment(c._id)}
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
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


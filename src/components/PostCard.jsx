import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaThumbsUp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaCommentDots,
} from "react-icons/fa";
import { useState, useContext } from "react";
import { toggleLikePost } from "../api/posts.js";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

// Utility to strip HTML tags
const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  const [imageError, setImageError] = useState(false);

  //FIXED Like State
  const [likes, setLikes] = useState(post?.likes?.length ?? 0);
  const [liked, setLiked] = useState(
    post?.likes?.includes(user?._id) ?? false
  );
  const [liking, setLiking] = useState(false);

  if (!post || !post.slug) return null;

  const title = post.title || "Untitled Post";
  const content = post.content
    ? stripHtml(post.content).slice(0, 120) +
      (stripHtml(post.content).length > 120 ? "..." : "")
    : "No description available.";

  const author = post?.author?.name || "Unknown Author";
  const username = post?.author?.username || "";
  const avatar = post?.author?.avatar || "/images/default-avatar.png";

  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://bp-server-11.onrender.com/api";

  const imageUrl =
    !imageError && post.image
      ? post.image.startsWith("http")
        ? post.image
        : `${BASE_URL.replace("/api", "")}/${post.image.replace(/\\/g, "/")}`
      : "/default-post.png";

  const postUrl = `/post/${post.slug}`;
  const fullUrl = `${window.location.origin}${postUrl}`;
  const encodedTitle = encodeURIComponent(title);

  //Share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${fullUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${fullUrl}`,
  };

  const handleShare = (platform) => {
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  //FIXED Like Handler
  const handleLike = async () => {
    if (!user) {
  toast.info("Please login to like posts");
  return;
}
    if (liking) return;

    try {
      setLiking(true);

      const res = await toggleLikePost(post._id);

      setLikes(res.likesCount);
      setLiked(res.liked);
    } catch (err) {
      console.error("❌ Error liking post:", err);
      alert(err?.response?.data?.message || "Failed to like post");
    } finally {
      setLiking(false);
    }
  };

  //Latest comments preview
  const latestComments = post?.comments?.slice(-2) || [];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      
      {/* Image */}
      <Link to={postUrl}>
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Title */}
        <Link to={postUrl}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {content}
        </p>

        {/* Comments Preview */}
        {latestComments.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <FaCommentDots /> Latest Comments
            </div>
            {latestComments.map((c, idx) => (
              <p key={idx} className="text-gray-700 text-xs mb-1">
                <span className="font-semibold">
                  {c.user?.name || "User"}:
                </span>{" "}
                {c.text}
              </p>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="flex justify-between items-end mt-auto">
          <div className="text-xs text-gray-500 space-y-2">

            {/* Author */}
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt={author}
                className="w-6 h-6 rounded-full object-cover border"
              />
              {username ? (
                <Link
                  to={`/author/${username}`}
                  className="text-blue-600 hover:underline"
                >
                  {author}
                </Link>
              ) : (
                author
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <FaCalendarAlt /> {date}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">

              {/* Like */}
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-1 ${
                  liked ? "text-blue-600" : "text-gray-600"
                } hover:text-blue-500 transition ${
                  liking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaThumbsUp />
                {likes}
              </button>

              {/* Share */}
              {["facebook", "twitter", "linkedin", "whatsapp", "email"].map(
                (platform) => {
                  const Icon =
                    platform === "facebook"
                      ? FaFacebook
                      : platform === "twitter"
                      ? FaTwitter
                      : platform === "linkedin"
                      ? FaLinkedin
                      : platform === "whatsapp"
                      ? FaWhatsapp
                      : FaEnvelope;

                  return (
                    <button
                      key={platform}
                      onClick={() => handleShare(platform)}
                      className="text-gray-500 hover:text-blue-600 transition"
                    >
                      <Icon />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Read More */}
          <Link
            to={postUrl}
            className="text-blue-600 font-medium hover:underline"
          >
            Read More →
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default PostCard;
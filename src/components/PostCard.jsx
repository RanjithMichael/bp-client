import { Link } from "react-router-dom";
import {
  FaUser,
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

// Utility to strip HTML tags
const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  const [imageError, setImageError] = useState(false);
  const [likes, setLikes] = useState(post?.likes?.length ?? 0);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) ?? false);
  const [liking, setLiking] = useState(false);

  if (!post || !post.slug) return null;

  const title = post.title || "Untitled Post";
  const content = post.content
    ? stripHtml(post.content).slice(0, 120) +
      (stripHtml(post.content).length > 120 ? "..." : "")
    : "No description available.";
  const author = post?.author?.name || "Unknown Author";
  const username = post?.author?.username || "";
  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://bp-server-9.onrender.com/api";
  const imageUrl =
    !imageError && post.image
      ? post.image.startsWith("http")
        ? post.image
        : `${BASE_URL.replace("/api", "")}/uploads/${post.image
            .replace(/\\/g, "/")
            .replace(/^uploads\//, "")}`
      : "/default-post.png";

  const postUrl = `/post/${post.slug}`;
  const fullUrl = `${window.location.origin}${postUrl}`;
  const encodedTitle = encodeURIComponent(title);

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

  // Like handler
  const handleLike = async () => {
    if (liking) return; // prevent double clicks
    try {
      setLiking(true);
      const res = await toggleLikePost(post._id);

      // ✅ Update state from backend response
      setLikes(res.likesCount);
      setLiked(res.liked);
    } catch (err) {
      console.error("❌ Error liking post:", err);
      alert(err.message || "Failed to like post. Please try again.");
    } finally {
      setLiking(false);
    }
  };

  // Show latest 2 comments
  const latestComments = post?.comments?.slice(-2) || [];

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
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
      <div className="p-4 flex flex-col flex-grow">
        <Link to={postUrl}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 line-clamp-2">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{content}</p>

        {/* Comment Preview */}
        {latestComments.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-2 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <FaCommentDots /> Latest Comments
            </div>
            {latestComments.map((c, idx) => (
              <p key={idx} className="text-gray-700 text-xs mb-1">
                <span className="font-semibold">{c.user?.name || "User"}:</span>{" "}
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
          <div className="text-xs text-gray-500 space-y-1">
            {/* Author */}
            <div className="flex items-center gap-1">
              <FaUser aria-label="Post author" />
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
              <FaCalendarAlt aria-label="Post date" /> {date}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Like Button */}
              <button
                onClick={handleLike}
                aria-label="Like post"
                disabled={liking}
                className={`flex items-center gap-1 ${
                  liked ? "text-blue-600" : "text-gray-600"
                } hover:text-blue-500 transition`}
              >
                <FaThumbsUp /> {likes}
              </button>

              {/* Share Buttons */}
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
                      title={`Share on ${
                        platform.charAt(0).toUpperCase() + platform.slice(1)
                      }`}
                      aria-label={`Share on ${platform}`}
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
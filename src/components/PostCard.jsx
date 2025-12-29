import { Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaThumbsUp, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useState } from "react";

const PostCard = ({ post }) => {
  const [imageError, setImageError] = useState(false);

  // Fallbacks and formatting
  const title = post?.title || "Untitled Post";
  const content =
    post?.content?.length > 120
      ? post.content.substring(0, 120) + "..."
      : post?.content || "No description available.";
  const author = post?.author?.name || "Unknown Author";
  const username = post?.author?.username || "";
  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  // Fix image path (for Render or backend servers)
  const imageUrl = !imageError
    ? post?.image?.startsWith("http")
      ? post.image
      : `https://bp-server-4.onrender.com/uploads/${post.image
          ?.replace(/\\/g, "/")
          ?.replace(/^uploads\//, "")}`
    : "/default-post.png";

  // Real social media share handler
  const handleShare = (platform) => {
    const postSlug = post?.slug || post?._id;
    const postUrl = `${window.location.origin}/post/${postSlug}`;
    const encodedTitle = encodeURIComponent(post.title);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${postUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=Check this out: ${postUrl}`,
    };

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <Link to={`/post/${post.slug || post._id}`}>
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/post/${post.slug || post._id}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{content}</p>

        {/* Author + Date + Engagement */}
        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FaUser className="w-4 h-4" />
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
            </span>

            <span className="flex items-center gap-1">
              <FaCalendarAlt className="w-4 h-4" /> {date}
            </span>

            {/* Likes + Shares */}
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <FaThumbsUp className="w-4 h-4 text-blue-500" /> {post.analytics?.likes || 0}
              </span>

              {/* Social sharing buttons */}
              <div className="flex items-center gap-2">
                <button onClick={() => handleShare("facebook")} title="Share on Facebook">
                  <FaFacebook className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                </button>
                <button onClick={() => handleShare("twitter")} title="Share on Twitter">
                  <FaTwitter className="w-4 h-4 text-sky-500 hover:text-sky-600" />
                </button>
                <button onClick={() => handleShare("linkedin")} title="Share on LinkedIn">
                  <FaLinkedin className="w-4 h-4 text-blue-700 hover:text-blue-800" />
                </button>
                <button onClick={() => handleShare("whatsapp")} title="Share on WhatsApp">
                  <FaWhatsapp className="w-4 h-4 text-green-500 hover:text-green-600" />
                </button>
                <button onClick={() => handleShare("email")} title="Share via Email">
                  <FaEnvelope className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                </button>
              </div>
            </div>
          </div>

          <Link
            to={`/post/${post.slug || post._id}`}
            className="text-blue-600 font-medium hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

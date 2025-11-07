import { Link } from "react-router-dom";
import { User, Calendar, ThumbsUp } from "lucide-react";
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
    const title = encodeURIComponent(post.title);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${postUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title}%20${postUrl}`,
      email: `mailto:?subject=${title}&body=Check%20this%20out:%20${postUrl}`,
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
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />{" "}
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
              <Calendar className="w-4 h-4" /> {date}
            </span>

            {/* Likes + Shares */}
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-blue-500" />{" "}
                {post.analytics?.likes || 0}
              </span>

              {/* Real social sharing buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare("facebook")}
                  title="Share on Facebook"
                >
                  <i className="fab fa-facebook text-blue-600 hover:text-blue-700"></i>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  title="Share on Twitter"
                >
                  <i className="fab fa-twitter text-sky-500 hover:text-sky-600"></i>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  title="Share on LinkedIn"
                >
                  <i className="fab fa-linkedin text-blue-700 hover:text-blue-800"></i>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  title="Share on WhatsApp"
                >
                  <i className="fab fa-whatsapp text-green-500 hover:text-green-600"></i>
                </button>
                <button
                  onClick={() => handleShare("email")}
                  title="Share via Email"
                >
                  <i className="fas fa-envelope text-gray-600 hover:text-gray-800"></i>
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

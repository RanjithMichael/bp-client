import { Link } from "react-router-dom";
import { User, Calendar, ThumbsUp, Share2 } from "lucide-react";
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

  // Resolve proper image path
  const imageUrl = !imageError
    ? post?.image?.startsWith("http")
      ? post.image
      : `https://bp-server-4.onrender.com/${post.image?.replace(/\\/g, "/")}`
    : "/default-post.png";

  // Share function (copies link)
  const handleShare = (e) => {
    e.preventDefault();
    const postSlug = post?.slug || post?._id;
    const postUrl = `${window.location.origin}/post/${postSlug}`;
    navigator.clipboard.writeText(postUrl);
    alert("📋 Post link copied! You can share it now.");
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

            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-blue-500" />{" "}
                {post.analytics?.likes || 0}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-purple-500 hover:text-purple-600 transition"
              >
                <Share2 className="w-4 h-4" /> {post.analytics?.shares || 0}
              </button>
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


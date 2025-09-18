/* src/components/PostCard.jsx */
import { Link } from "react-router-dom";
import { User, Calendar, ThumbsUp, Share2 } from "lucide-react";

const PostCard = ({ post }) => {
  const title = post?.title || "Untitled Post";
  const content =
    post?.content?.length > 120
      ? post.content.substring(0, 120) + "..."
      : post?.content || "No description available.";
  const author = post?.author?.name || "Unknown Author";
  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  return (
    <Link
      to={`/post/${post._id}`} // ✅ Navigates to PostDetails page
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      {post?.image && (
        <img
          src={post.image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{content}</p>

        {/* Author + Date + Engagement */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {date}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-blue-500" />{" "}
                {post.analytics?.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-4 h-4 text-purple-500" />{" "}
                {post.analytics?.shares || 0}
              </span>
            </div>
          </div>

          <span className="text-blue-600 font-medium hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;


/* src/components/PostCard.jsx */
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Thumbnail (if available) */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.content}
        </p>

        <div className="flex justify-between items-center">
          {/* Author + Date */}
          <div className="text-xs text-gray-500">
            <span>✍️ {post?.author?.name || "Unknown"}</span>
            <span className="ml-2">
              📅 {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Read More */}
          <Link
            to={`/posts/${post._id}`}
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


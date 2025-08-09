import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/posts/${post._id}`}>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
          <p className="text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
          <div className="mt-4 text-sm text-gray-500">
            By {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Link>
    </div>
  );
}

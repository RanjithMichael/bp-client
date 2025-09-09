import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="border rounded shadow p-4 bg-white hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.content.substring(0, 100)}...</p>
      <Link to={`/post/${post._id}`} className="text-blue-500">Read More</Link>
    </div>
  );
};

export default PostCard;

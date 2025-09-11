/* src/components/Comment.jsx */
const Comment = ({ comment }) => {
  return (
    <div className="border rounded-lg p-3 mb-3 bg-gray-50 shadow-sm">
      {/* Header: Author + Date */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-semibold text-gray-800">
          {comment.user?.name || "Anonymous"}
        </p>
        <span className="text-xs text-gray-500">
          {comment.createdAt
            ? new Date(comment.createdAt).toLocaleString()
            : ""}
        </span>
      </div>

      {/* Comment Text */}
      <p className="text-gray-700 text-sm">{comment.text}</p>
    </div>
  );
};

export default Comment;


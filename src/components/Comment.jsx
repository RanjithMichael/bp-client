const Comment = ({ comment }) => {
  const author = comment.user?.name || "Anonymous";
  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm hover:shadow-md transition">
      {/* Header: Avatar + Author + Date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <img
            src={comment.user?.avatar || "/images/default.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border"
          />
          <p
            className="text-sm font-semibold text-gray-800"
            aria-label="Comment author"
          >
            {author}
          </p>
        </div>
        <span className="text-xs text-gray-500">{date}</span>
      </div>

      {/* Comment Text */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {comment.text?.trim() || "No content provided"}
      </p>
    </div>
  );
};

export default Comment;


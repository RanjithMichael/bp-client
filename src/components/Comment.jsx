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
    <div className="border rounded-lg p-3 mb-3 bg-gray-50 shadow-sm">
      {/* Header: Author + Date */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-semibold text-gray-800" aria-label="Comment author">
          {author}
        </p>
        <span className="text-xs text-gray-500">{date}</span>
      </div>

      {/* Comment Text */}
      <p className="text-gray-700 text-sm">
        {comment.text?.trim() || "No content provided"}
      </p>
    </div>
  );
};

export default Comment;


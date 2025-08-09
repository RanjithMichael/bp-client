import { useState } from "react";

export default function CommentSection({ comments, onAddComment }) {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <div className="space-y-4">
        {comments.map((comment, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded-md">
            <p className="text-gray-800">{comment.text}</p>
            <span className="text-sm text-gray-500">
              {comment.user || "Anonymous"} • {new Date(comment.date).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddComment}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Post
        </button>
      </div>
    </div>
  );
}

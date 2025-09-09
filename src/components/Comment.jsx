const Comment = ({ comment }) => (
  <div className="border rounded p-2 mb-2 bg-gray-50">
    <p className="text-gray-800 font-medium">{comment.user.name}</p>
    <p>{comment.text}</p>
  </div>
);

export default Comment;

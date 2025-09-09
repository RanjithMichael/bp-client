import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import Comment from "../components/Comment";
import { AuthContext } from "../context/AuthContext";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleComment = async () => {
    if (!user) return alert("Login to comment");
    try {
      const res = await API.post(`/posts/${id}/comments`, { text: commentText });
      setPost(prev => ({ ...prev, comments: res.data }));
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.content}</p>

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="mb-4">
        {post.comments.map(comment => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>

      {user && (
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button onClick={handleComment} className="bg-blue-500 text-white p-2 rounded w-32">Comment</button>
        </div>
      )}
    </div>
  );
};

export default PostDetails;

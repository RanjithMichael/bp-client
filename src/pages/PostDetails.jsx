import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import SubscribeButton from "../components/SubscribeButton";
import AnalyticsChart from "../components/AnalyticsChart";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
        setLikes(data.likes || 0);
        setShares(data.shares || 0);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await API.post(
        `/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setLikes(data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleShare = async () => {
    try {
      const { data } = await API.post(
        `/posts/${id}/share`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setShares(data.shares);

      // For now just copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Post link copied! Share it anywhere.");
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  if (!post) return <p className="text-center mt-4">Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      {/* Post Title */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* Author + Date */}
      <p className="text-gray-600 mb-4">
        By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Post Content */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* ✅ Subscribe button */}
      {user && (
        <div className="mt-4">
          <SubscribeButton authorId={post.author?._id} category={post.category} />
        </div>
      )}

      {/* ✅ Like & Share Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleLike}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          👍 Like ({likes})
        </button>
        <button
          onClick={handleShare}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🔗 Share ({shares})
        </button>
      </div>

      {/* ✅ Analytics Chart */}
      <div className="mt-8">
        <AnalyticsChart />
      </div>
    </div>
  );
};

export default PostDetails;

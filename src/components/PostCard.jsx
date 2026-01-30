import { Link } from "react-router-dom";
import {
  FaUser,
  FaCalendarAlt,
  FaThumbsUp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { useState } from "react";
import API from "../api/axiosConfig";

// Utility to strip HTML tags
const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");

const PostCard = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [likes, setLikes] = useState(post?.likes?.length ?? 0);
  const [liked, setLiked] = useState(false);

  // ❗ SAFETY CHECK — prevents broken routes
  if (!post || !post.slug) return null;

  const title = post.title || "Untitled Post";
  const content = post.content
    ? stripHtml(post.content).slice(0, 120) + "..."
    : "No description available.";
  const author = post?.author?.name || "Unknown Author";
  const username = post?.author?.username || "";
  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  const imageUrl = !imageError && post.image
    ? post.image.startsWith("http")
      ? post.image
      : `https://bp-server-4.onrender.com/uploads/${post.image
          .replace(/\\/g, "/")
          .replace(/^uploads\//, "")}`
    : "/default-post.png";

  const postUrl = `/post/${post.slug}`;

  const handleShare = (platform) => {
    const fullUrl = `${window.location.origin}${postUrl}`;
    const encodedTitle = encodeURIComponent(title);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${fullUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${fullUrl}`,
    };

    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  const handleLike = async () => {
    try {
      const { data } = await API.patch(`/posts/${post._id}/like`);
      setLikes(data.likesCount);
      setLiked(data.liked);
    } catch (err) {
      console.error("❌ Error liking post:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      <Link to={postUrl}>
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={postUrl}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 line-clamp-2">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{content}</p>

        <div className="flex justify-between items-end mt-auto">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <FaUser />
              {username ? (
                <Link to={`/author/${username}`} className="text-blue-600">
                  {author}
                </Link>
              ) : (
                author
              )}
            </div>

            <div className="flex items-center gap-1">
              <FaCalendarAlt /> {date}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 ${
                  liked ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <FaThumbsUp /> {likes}
              </button>

              <FaFacebook onClick={() => handleShare("facebook")} />
              <FaTwitter onClick={() => handleShare("twitter")} />
              <FaLinkedin onClick={() => handleShare("linkedin")} />
              <FaWhatsapp onClick={() => handleShare("whatsapp")} />
              <FaEnvelope onClick={() => handleShare("email")} />
            </div>
          </div>

          <Link to={postUrl} className="text-blue-600 font-medium hover:underline">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

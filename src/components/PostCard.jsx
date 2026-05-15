import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaThumbsUp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaCommentDots,
} from "react-icons/fa";
import { useState, useContext } from "react";
import { toggleLikePost } from "../api/posts.js";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

// Utility to strip HTML tags
const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");

// Map of category-specific fallback images
const categoryFallback = {
  datascientist: "https://res.cloudinary.com/djle175hb/image/upload/v1778841309/0_gMvS7ZBIoCX8-Mqe_emfljf.jpg",
  businessanalyst: "https://res.cloudinary.com/djle175hb/image/upload/v1778841394/https_3A_2F_2Fwww.hbs.edu_2Fctfassets_2Fpublic_2Fimages_2F5zdIhFfQlGehyJLZCR11FB_2FBA_2520Image_sopvyb.webp",
  computercoding: "https://res.cloudinary.com/djle175hb/image/upload/v1778841533/7200_myugxi.jpg",
  machinelearning: "https://res.cloudinary.com/djle175hb/image/upload/v1778841707/what-is-machine-learning-1024x683_vbjhb6.png",
  ai: "https://res.cloudinary.com/djle175hb/image/upload/v1778841815/where-is-ai-used_vbmbey.jpg",
  htmlandcss: "https://res.cloudinary.com/djle175hb/image/upload/v1778841882/1_lJ32Bl-lHWmNMUSiSq17gQ_erfbwd.png",
  webdevelopment: "https://res.cloudinary.com/djle175hb/image/upload/v1778842008/1_V-Jp13LvtVc2IiY2fp4qYw_n6djkw.jpg",
  mobileappdevelopement: "https://res.cloudinary.com/djle175hb/image/upload/v1778842101/7115055_1997_2_ldotl5.jpg",
  cybersecurity: "https://res.cloudinary.com/djle175hb/image/upload/v1778842174/Cybersecurity_certiprof_t8uqpa.jpg",
  default: "https://res.cloudinary.com/djle175hb/image/upload/v1778771435/DALL_C2_B7E-2025-02-11-18.59.04-A-modern-and-professional-illustration-depicting-a-computer-programmer-working-on-code.-The-image-should-feature-a-clean-workspace-with-a-laptop-displ_vkl7n2.webp"
};


const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  const [imageError, setImageError] = useState(false);

  // Like State
  const [likes, setLikes] = useState(post?.likesCount ?? 0);
  const [liked, setLiked] = useState(post?.liked ?? false);
  const [liking, setLiking] = useState(false);

  if (!post || !post.slug) return null;

  const title = post.title || "Untitled Post";
  const content = post.content
    ? stripHtml(post.content).slice(0, 120) +
      (stripHtml(post.content).length > 120 ? "..." : "")
    : "No description available.";

  const author = post?.author?.name || "Unknown Author";
  const username = post?.author?.username || "";
  const avatar = post?.author?.profilePic || "/images/default-avatar.png";

  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown Date";

  // ✅ Use Cloudinary coverImage with category fallback
  const primaryCategory = post?.categories?.[0]?.toLowerCase();
  const imageUrl =
    !imageError && post?.coverImage
      ? post.coverImage
      : categoryFallback[primaryCategory] || categoryFallback.generic;

  const postUrl = `/post/${post.slug}`;
  const fullUrl = `${window.location.origin}${postUrl}`;
  const encodedTitle = encodeURIComponent(title);

  // Share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${fullUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${fullUrl}`,
  };

  const handleShare = (platform) => {
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  // Like Handler
  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like posts");
      return;
    }
    if (liking) return;

    try {
      setLiking(true);

      // Call backend
      const res = await toggleLikePost(post._id);

      // ✅ Use backend fields directly
      setLikes(res.likesCount);
      setLiked(res.liked);

      toast.success(res.liked ? "👍 Post liked!" : "👎 Like removed.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  // Latest comments preview
  const latestComments = post?.comments?.slice(-2) || [];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={postUrl}>
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <Link to={postUrl}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{content}</p>

        {/* Comments Preview */}
        {latestComments.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <FaCommentDots /> Latest Comments
            </div>
            {latestComments.map((c, idx) => (
              <p key={idx} className="text-gray-700 text-xs mb-1">
                <span className="font-semibold">
                  {c.user?.name || "User"}:
                </span>{" "}
                {c.text}
              </p>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="flex justify-between items-end mt-auto">
          <div className="text-xs text-gray-500 space-y-2">
            {/* Author */}
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt={author}
                className="w-6 h-6 rounded-full object-cover border"
              />
              {username ? (
                <Link
                  to={`/author/${username}`}
                  className="text-blue-600 hover:underline"
                >
                  {author}
                </Link>
              ) : (
                author
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <FaCalendarAlt /> {date}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-1 ${
                  liked ? "text-blue-600" : "text-gray-600"
                } hover:text-blue-500 transition ${
                  liking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaThumbsUp />
                {likes}
              </button>

              {/* Share */}
              {["facebook", "twitter", "linkedin", "whatsapp", "email"].map(
                (platform) => {
                  const Icon =
                    platform === "facebook"
                      ? FaFacebook
                      : platform === "twitter"
                      ? FaTwitter
                      : platform === "linkedin"
                      ? FaLinkedin
                      : platform === "whatsapp"
                      ? FaWhatsapp
                      : FaEnvelope;

                  return (
                    <button
                      key={platform}
                      onClick={() => handleShare(platform)}
                      className="text-gray-500 hover:text-blue-600 transition"
                    >
                      <Icon />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Read More */}
          <Link
            to={postUrl}
            className="text-blue-600 font-medium hover:underline"
          >
            Read More →
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default PostCard;

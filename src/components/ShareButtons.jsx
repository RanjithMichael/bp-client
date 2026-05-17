import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { incrementSharePost } from "../api/posts"; // ✅ backend API helper

export default function ShareButtons({ url, title, postId, initialShares = 0 }) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const [shares, setShares] = useState(initialShares);

  const handleShare = async (platform) => {
    try {
      // open share window
      window.open(shareUrl, "_blank", "noopener,noreferrer");

      // call backend to increment share count
      const res = await incrementSharePost(postId);
      setShares(res.sharesCount);

      toast.success("🔗 Post shared!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update share count");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 items-center">
      <FacebookShareButton url={shareUrl} quote={shareTitle} aria-label="Share on Facebook" onClick={() => handleShare("facebook")}>
        <button
          type="button"
          aria-label="Share on Facebook"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaFacebook /> Facebook
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={shareTitle} aria-label="Share on Twitter" onClick={() => handleShare("twitter")}>
        <button
          type="button"
          aria-label="Share on Twitter"
          className="flex items-center gap-2 bg-sky-500 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaTwitter /> Twitter
        </button>
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} aria-label="Share on LinkedIn" onClick={() => handleShare("linkedin")}>
        <button
          type="button"
          aria-label="Share on LinkedIn"
          className="flex items-center gap-2 bg-blue-700 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaLinkedin /> LinkedIn
        </button>
      </LinkedinShareButton>

      <WhatsappShareButton url={shareUrl} title={shareTitle} aria-label="Share on WhatsApp" onClick={() => handleShare("whatsapp")}>
        <button
          type="button"
          aria-label="Share on WhatsApp"
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaWhatsapp /> WhatsApp
        </button>
      </WhatsappShareButton>

      <EmailShareButton url={shareUrl} subject={shareTitle} aria-label="Share via Email" onClick={() => handleShare("email")}>
        <button
          type="button"
          aria-label="Share via Email"
          className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaEnvelope /> Email
        </button>
      </EmailShareButton>

      {/* ✅ Live share count */}
      <span className="ml-2 text-sm text-gray-600">Shares: {shares}</span>
    </div>
  );
}

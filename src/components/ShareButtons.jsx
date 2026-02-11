import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function ShareButtons({ url, title }) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <FacebookShareButton url={shareUrl} quote={shareTitle} aria-label="Share on Facebook">
        <button
          type="button"
          aria-label="Share on Facebook"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaFacebook /> Facebook
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={shareTitle} aria-label="Share on Twitter">
        <button
          type="button"
          aria-label="Share on Twitter"
          className="flex items-center gap-2 bg-sky-500 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaTwitter /> Twitter
        </button>
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} aria-label="Share on LinkedIn">
        <button
          type="button"
          aria-label="Share on LinkedIn"
          className="flex items-center gap-2 bg-blue-700 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaLinkedin /> LinkedIn
        </button>
      </LinkedinShareButton>

      <WhatsappShareButton url={shareUrl} title={shareTitle} aria-label="Share on WhatsApp">
        <button
          type="button"
          aria-label="Share on WhatsApp"
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaWhatsapp /> WhatsApp
        </button>
      </WhatsappShareButton>

      <EmailShareButton url={shareUrl} subject={shareTitle} aria-label="Share via Email">
        <button
          type="button"
          aria-label="Share via Email"
          className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90 transition"
        >
          <FaEnvelope /> Email
        </button>
      </EmailShareButton>
    </div>
  );
}
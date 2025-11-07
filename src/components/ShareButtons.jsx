import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function ShareButtons({ url, title }) {
  const shareUrl = encodeURIComponent(url || window.location.href);
  const shareTitle = encodeURIComponent(title || document.title);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <FacebookShareButton url={shareUrl} quote={shareTitle} aria-label="Share on Facebook">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:opacity-90 transition">
          <FaFacebook /> Facebook
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={shareTitle} aria-label="Share on Twitter">
        <button className="flex items-center gap-2 bg-sky-500 text-white px-3 py-1 rounded hover:opacity-90 transition">
          <FaTwitter /> Twitter
        </button>
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} aria-label="Share on LinkedIn">
        <button className="flex items-center gap-2 bg-blue-700 text-white px-3 py-1 rounded hover:opacity-90 transition">
          <FaLinkedin /> LinkedIn
        </button>
      </LinkedinShareButton>

      <WhatsappShareButton url={shareUrl} title={shareTitle} aria-label="Share on WhatsApp">
        <button className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded hover:opacity-90 transition">
          <FaWhatsapp /> WhatsApp
        </button>
      </WhatsappShareButton>

      <EmailShareButton url={shareUrl} subject={shareTitle} aria-label="Share via Email">
        <button className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90 transition">
          <FaEnvelope /> Email
        </button>
      </EmailShareButton>
    </div>
  );
}

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share';

export default function ShareButtons({ url, title }) {
  const shareUrl = url || window.location.href;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <FacebookShareButton url={shareUrl} quote={title} aria-label="Share on Facebook">
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:opacity-90 transition">
          Facebook
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title} aria-label="Share on Twitter">
        <button className="bg-sky-500 text-white px-3 py-1 rounded hover:opacity-90 transition">
          Twitter
        </button>
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} aria-label="Share on LinkedIn">
        <button className="bg-blue-700 text-white px-3 py-1 rounded hover:opacity-90 transition">
          LinkedIn
        </button>
      </LinkedinShareButton>

      <WhatsappShareButton url={shareUrl} title={title} aria-label="Share on WhatsApp">
        <button className="bg-green-500 text-white px-3 py-1 rounded hover:opacity-90 transition">
          WhatsApp
        </button>
      </WhatsappShareButton>

      <EmailShareButton url={shareUrl} subject={title} aria-label="Share via Email">
        <button className="bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90 transition">
          Email
        </button>
      </EmailShareButton>
    </div>
  );
}

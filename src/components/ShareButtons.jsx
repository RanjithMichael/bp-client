import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share';

export default function ShareButtons({ url, title }) {
  return (
    <div className="flex gap-2 mt-4">
      <FacebookShareButton url={url} quote={title}>
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Facebook</button>
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <button className="bg-sky-500 text-white px-3 py-1 rounded">Twitter</button>
      </TwitterShareButton>
      <LinkedinShareButton url={url}>
        <button className="bg-blue-700 text-white px-3 py-1 rounded">LinkedIn</button>
      </LinkedinShareButton>
      <WhatsappShareButton url={url} title={title}>
        <button className="bg-green-500 text-white px-3 py-1 rounded">WhatsApp</button>
      </WhatsappShareButton>
      <EmailShareButton url={url} subject={title}>
        <button className="bg-gray-600 text-white px-3 py-1 rounded">Email</button>
      </EmailShareButton>
    </div>
  );
}
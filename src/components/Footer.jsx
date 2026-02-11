const Footer = ({ brand = "BlogPlatform" }) => (
  <footer
    className="bg-gray-800 text-white text-center p-4 mt-8"
    role="contentinfo"
  >
    &copy; {new Date().getFullYear()} {brand}. All rights reserved.
  </footer>
);

export default Footer;
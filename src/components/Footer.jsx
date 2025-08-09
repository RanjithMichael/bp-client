export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Blogify. All rights reserved.</p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}

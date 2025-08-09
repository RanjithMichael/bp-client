import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="mt-4 text-gray-600">Page not found</p>
      <Link
        to="/"
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Go Home
      </Link>
    </div>
  );
}

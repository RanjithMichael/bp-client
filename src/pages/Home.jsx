
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import API from "../api/axiosConfig";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/posts?search=${search}`);
        setPosts(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search input by 500ms
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup if input changes
  }, [search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="ml-4 text-gray-200 text-lg">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[url('/images/Big-Ben-At-Night.jpg')]
        bg-cover
        bg-center
        relative
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-10">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              // Pass the slug instead of _id
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-200 mt-16 text-xl">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
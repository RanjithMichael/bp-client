import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { getPaginated } from "../api/axiosConfig";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // posts per page

  // Main fetch function
  const fetchPosts = async (reset = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const data = await getPaginated("/posts", page, limit, search);

      if (!data || !data.posts) throw new Error("No data returned from API");

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch posts. Please try again later.";
      setError(message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Search Effect (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchPosts(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Fetch when page changes (pagination)
  useEffect(() => {
    if (page > 1) fetchPosts(false);
  }, [page]);

  // Initial Load
  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="ml-4 text-gray-200 text-lg">Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-4 text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => fetchPosts(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
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
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 container mx-auto px-4 py-10">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                {loadingMore ? (
                  <button
                    disabled
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg opacity-70"
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
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


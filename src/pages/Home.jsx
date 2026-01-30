import { useState, useEffect, useCallback } from "react";
import PostCard from "../components/PostCard";
import { getPaginated } from "../api/axiosConfig.js";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setPage(1);
        } else {
          setLoadingMore(true);
        }

        const data = await getPaginated(
          "/posts",
          reset ? 1 : page,
          limit,
          search
        );

        if (!data || !data.posts) {
          throw new Error("No data returned from API");
        }

        // ✅ FILTER INVALID POSTS (VERY IMPORTANT)
        const validPosts = data.posts.filter(
          (post) =>
            post &&
            post._id &&
            post.slug && // slug must exist
            post.title &&
            post.content &&
            post.isDeleted !== true
        );

        setPosts((prev) =>
          reset ? validPosts : [...prev, ...validPosts]
        );

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
    },
    [page, search]
  );

  // 🔍 Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPosts(true);
    }, 500);

    return () => clearTimeout(delay);
  }, [search, fetchPosts]);

  // Pagination
  useEffect(() => {
    if (page > 1) fetchPosts(false);
  }, [page, fetchPosts]);

  // Initial load
  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="min-h-screen bg-gray-900 relative">
      <div className="container mx-auto px-4 py-10">
        {/* Search */}
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
          <p className="text-center text-gray-300 mt-16 text-xl">
            {search
              ? `No posts found for "${search}".`
              : "No posts available yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;

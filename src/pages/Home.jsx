import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setPage(1);
        } else {
          setLoadingMore(true);
        }

        const data = await getPaginated("/posts", reset ? 1 : page, limit, search);
        const rawPosts = data.posts || data.data || [];

        if (!Array.isArray(rawPosts)) {
          throw new Error("Invalid post data format");
        }

        const validPosts = rawPosts.filter(
          (post) =>
            post &&
            post._id &&
            post.slug &&
            post.title &&
            post.content &&
            post.isDeleted !== true
        );

        setPosts((prev) => (reset ? validPosts : [...prev, ...validPosts]));
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
    [page, search, limit]
  );

  // 🔍 Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setPosts([]);
      setPage(1);
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
  }, []);

  // ✅ Update likes/unlikes in parent state
  const handleLikeUpdate = (postId, likesCount, liked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, likes: Array(likesCount).fill("dummy"), liked } : p
      )
    );
  };

  // UI STATES
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-gray-200 text-lg">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-4 text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => {
            setPosts([]);
            setPage(1);
            fetchPosts(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-10">
        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            aria-label="Search posts"
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
                <PostCard
                  key={post._id}
                  post={post}
                  onLikeUpdate={handleLikeUpdate} // ✅ pass handler
                />
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
                    aria-label="Load more posts"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <p className="text-gray-300 text-xl mb-6">
              {search
                ? `No posts found for "${search}". Try a different keyword.`
                : "No posts available yet."}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/create-post")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                Create Your First Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

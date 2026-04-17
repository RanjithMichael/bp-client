import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getPaginatedPosts } from "../api/posts.js";
import { toast } from "react-toastify";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;
  const navigate = useNavigate();

  //DEBOUNCE SEARCH (better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
      setPosts([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  //FETCH POSTS
  const fetchPosts = useCallback(
    async (pageToFetch = 1, reset = false) => {
      try {
        if (reset) setLoading(true);
        else setLoadingMore(true);

        const data = await getPaginatedPosts(
          pageToFetch,
          limit,
          debouncedSearch
        );

        const rawPosts = data?.posts || data?.data || [];

        if (!Array.isArray(rawPosts)) {
          throw new Error("Invalid post data format");
        }

        //Strong validation
        const validPosts = rawPosts.filter((post) => {
          return (
            post &&
            post._id &&
            typeof post._id === "string" &&
            post.slug &&
            typeof post.slug === "string" &&
            post.title?.trim() &&
            post.content?.trim() &&
            post.isDeleted !== true
          );
        });

        //Prevent duplicates
        setPosts((prev) => {
          if (reset) return validPosts;

          const existingIds = new Set(prev.map((p) => p._id));
          const newPosts = validPosts.filter(
            (p) => !existingIds.has(p._id)
          );

          return [...prev, ...newPosts];
        });

        setTotalPages(data?.totalPages || 1);
        setError(null);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch posts.";

        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch]
  );

  //INITIAL LOAD + SEARCH
  useEffect(() => {
    fetchPosts(1, true);
  }, [debouncedSearch, fetchPosts]);

  //LOAD MORE
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  //LOADING UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-gray-300 text-lg">Loading posts...</p>
      </div>
    );
  }

  //ERROR UI
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-4 text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>

        <button
          onClick={() => {
            setPosts([]);
            setPage(1);
            fetchPosts(1, true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Retry
        </button>
      </div>
    );
  }

  //MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-10">

        {/* 🔍 SEARCH */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 p-3 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* 📰 POSTS */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* LOAD MORE */}
            {page < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-gray-300 text-xl mb-6">
              {debouncedSearch
                ? `No posts found for "${debouncedSearch}".`
                : "No posts available yet."}
            </p>

            {!debouncedSearch && (
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
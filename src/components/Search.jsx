import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Search({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await API.get(`/posts?search=${encodeURIComponent(query)}`);
        setResults(res.data.posts || []);
      } catch (err) {
        console.error(err?.response?.data || err);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  const handleClick = (slug) => {
    navigate(`/post/${slug}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
        <p className="text-gray-500 text-lg">Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // Results
  return (
    <div className="space-y-3">
      {query && results.length ? (
        results.map((post) => (
          <div
            key={post._id}
            role="button"
            aria-label={`View post: ${post.title}`}
            className="p-3 border border-gray-200 rounded-lg hover:shadow-md hover:bg-gray-50 cursor-pointer transition flex flex-col sm:flex-row sm:justify-between sm:items-center"
            onClick={() => handleClick(post.slug)}
          >
            <div>
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-gray-500 text-sm">
                {post.author?.name || post.author?.username || "Unknown Author"}
              </p>
            </div>
          </div>
        ))
      ) : query ? (
        <p className="text-gray-500 py-4">No posts found</p>
      ) : (
        <p className="text-gray-500 py-4">Enter a keyword to search posts</p>
      )}
    </div>
  );
}
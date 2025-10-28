import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import PostCard from "../components/PostCard";

export default function AuthorPage() {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch author info first
        const { data: authorData } = await API.get(`/users/${authorId}`);
        setAuthor(authorData || {});

        // Fetch posts by this author
        const { data: postsData } = await API.get(`/posts/author/${authorId}`);
        setPosts(postsData.posts || []);
      } catch (err) {
        console.error("Error fetching author or posts:", err);
        if (err.response?.status === 404) {
          setError("Author not found.");
        } else {
          setError("Failed to load author data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (authorId) fetchAuthorAndPosts();
  }, [authorId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mb-3"></div>
        <p className="text-gray-600 text-lg">Loading author details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  // No author found
  if (!author) {
    return (
      <div className="p-6 text-center text-gray-500">
        Author information not available.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 👤 Author Info */}
      <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white rounded-lg shadow p-6 border border-gray-100">
        <img
          src={
            author.profilePic
              ? author.profilePic.startsWith("http")
                ? author.profilePic
                : `${import.meta.env.VITE_API_URL}/${author.profilePic}`
              : "/default-avatar.png"
          }
          onError={(e) => (e.target.src = "/default-avatar.png")}
          alt={author.name || "Author avatar"}
          className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow-sm"
        />

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900">{author.name}</h2>
          <p className="text-gray-600 mt-2">
            {author.bio || "This author hasn’t added a bio yet."}
          </p>

          {/* 🌐 Social Links */}
          {author.socialLinks && Object.keys(author.socialLinks).length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              {Object.entries(author.socialLinks).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline capitalize"
                  >
                    {platform}
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📝 Author’s Posts */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Posts by {author.name || "this author"}
      </h3>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts by this author yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post._id} to={`/posts/${post.slug}`}>
              <PostCard post={post} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


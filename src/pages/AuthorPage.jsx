import { useParams } from "react-router-dom";
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

        // Fetch author data
        const { data: authorData } = await API.get(`/users/${authorId}`);
        setAuthor(authorData);

        // Fetch posts by author
        const { data: postData } = await API.get(`/posts/author/${authorId}`);
        setPosts(postData);
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mb-3"></div>
        <p>Fetching author details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 font-medium">{error}</div>;
  }

  if (!author) {
    return <div className="p-6 text-center text-gray-500">Author information not available.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Author Info */}
      <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={author.profilePicture || "/default-avatar.png"}
          onError={(e) => (e.target.src = "/default-avatar.png")}
          alt={author.name || "Author avatar"}
          className="w-28 h-28 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-bold">{author.name}</h2>
          <p className="text-gray-600 mt-1">{author.bio || "No bio available."}</p>

          {Array.isArray(author.socialLinks) && author.socialLinks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {author.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url || link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline capitalize"
                >
                  {link.platform || link.replace(/^https?:\/\//, "")}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Author's Posts */}
      <h3 className="text-xl font-semibold mb-4">
        Posts by {author.name || "this author"}
      </h3>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}



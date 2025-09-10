import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig.js';
import PostCard from '../components/PostCard.jsx';

export default function AuthorPage() {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      try {
        const [authorRes, postsRes] = await Promise.all([
          axios.get(`/users/${authorId}`),
          axios.get(`/posts?author=${authorId}`)
        ]);
        console.log("Author:", authorRes.data);
        console.log("Posts:", postsRes.data);
        setAuthor(authorRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Error fetching author or posts:", err);
        setError("Failed to load author data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorAndPosts();
  }, [authorId]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading author details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      {author ? (
        <div className="mb-6 flex items-center gap-4">
          <img
            src={author.profilePicture || "/default-avatar.png"}
            alt="Author"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{author.name}</h2>
            <p className="text-gray-600">{author.bio}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Author not found.</p>
      )}

      <h3 className="text-xl font-semibold mb-4">
        Posts by {author?.name || "this author"}
      </h3>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
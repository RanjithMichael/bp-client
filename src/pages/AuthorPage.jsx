import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import api from "../utils/api";

export default function AuthorPage() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setAuthor(res.data.user);
        setPosts(res.data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuthorData();
  }, [id]);

  if (!author) return <p className="text-center mt-10">Loading author...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold">{author.name}</h1>
        <p className="text-gray-600">{author.bio || "No bio available"}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts by {author.name}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>No posts from this author.</p>
        )}
      </div>
    </div>
  );
}

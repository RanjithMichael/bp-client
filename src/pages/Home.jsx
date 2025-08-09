import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import api from "../utils/api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="text-center col-span-full">No posts available.</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import api from "../utils/api";

export default function Subscriptions() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchSubscribedPosts = async () => {
      try {
        const res = await api.get("/subscriptions/posts");
        setPosts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubscribedPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Subscriptions</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>You have no subscriptions yet.</p>
        )}
      </div>
    </div>
  );
}

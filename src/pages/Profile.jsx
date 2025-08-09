import { useEffect, useState } from "react";
import api from "../utils/api";
import PostCard from "../components/PostCard";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">My Posts</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>You haven't created any posts yet.</p>
        )}
      </div>
    </div>
  );
}

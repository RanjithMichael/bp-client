import { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;


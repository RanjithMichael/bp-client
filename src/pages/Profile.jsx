import { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      API.get(`/users/${user._id}/posts`)
        .then(res => setPosts(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user) return <div className="p-4">Login to view profile</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{user.name}'s Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
};

export default Profile;

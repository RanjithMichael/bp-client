import { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.token) return;

      try {
        const { data } = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  if (!authUser) return <div className="p-4">Login to view profile</div>;
  if (loading) return <div className="p-4">Loading profile...</div>;
  if (!profile) return <div className="p-4 text-red-500">Failed to load profile.</div>;

  return (
    <div className="container mx-auto p-4">
      {/* User Info */}
      <h1 className="text-3xl font-bold mb-2">{profile.user.name}'s Profile</h1>
      <p className="text-gray-600 mb-6">Email: {profile.user.email}</p>

      {/* User Posts */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
        {profile.posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>

      {/* Subscriptions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
        {profile.subscriptions.length > 0 ? (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {profile.subscriptions.map((sub) => (
              <li key={sub._id}>
                {sub.author ? `Author: ${sub.author.name || "Unknown"}` : `Category: ${sub.category}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No subscriptions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;


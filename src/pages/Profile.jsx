import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      if (!token) {
        setError("You must be logged in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await API.get("/users/profile"); // no need for manual headers
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError("Profile not found.");
        } else {
          setError("Failed to load profile. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  // ❗ No profile data
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-400 text-lg">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* 🧑 User Info */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">
            {profile.user?.name || "Unnamed User"}'s Profile
          </h1>
          <p className="text-gray-600">
            Email: {profile.user?.email || "Not provided"}
          </p>
        </div>

        {/* 📝 User Posts */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          {profile.posts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't created any posts yet.</p>
          )}
        </div>

        {/* 📰 Subscriptions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
          {profile.subscriptions?.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {profile.subscriptions.map((sub) => (
                <li key={sub._id}>
                  {sub.author
                    ? `Author: ${sub.author.name || "Unknown"}`
                    : `Category: ${sub.category}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subscriptions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


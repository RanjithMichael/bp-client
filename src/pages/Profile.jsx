import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: "",
    social: { website: "", twitter: "", linkedin: "", github: "" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/users/profile");
        setProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          profilePic: data.profilePic || "",
          social: data.social || { website: "", twitter: "", linkedin: "", github: "" },
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["website", "twitter", "linkedin", "github"].includes(name)) {
      setFormData((prev) => ({ ...prev, social: { ...prev.social, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/users/profile", formData);
      setProfile(data);
      setEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* 🧑 User Info */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">{profile.name}'s Profile</h1>
          <p className="text-gray-600 mb-2">Email: {profile.email}</p>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                placeholder="Profile Picture URL"
                className="w-full border p-2 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="website"
                  value={formData.social.website}
                  onChange={handleChange}
                  placeholder="Website"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="twitter"
                  value={formData.social.twitter}
                  onChange={handleChange}
                  placeholder="Twitter"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="linkedin"
                  value={formData.social.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="github"
                  value={formData.social.github}
                  onChange={handleChange}
                  placeholder="GitHub"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
              {successMsg && <p className="text-green-600">{successMsg}</p>}
            </form>
          ) : (
            <>
              {profile.bio && <p className="text-gray-700 mt-2">Bio: {profile.bio}</p>}
              {profile.profilePic && (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mt-2"
                />
              )}
              {profile.social && (
                <div className="flex gap-4 mt-2">
                  {profile.social.website && (
                    <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Website
                    </a>
                  )}
                  {profile.social.twitter && (
                    <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Twitter
                    </a>
                  )}
                  {profile.social.linkedin && (
                    <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {profile.social.github && (
                    <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      GitHub
                    </a>
                  )}
                </div>
              )}
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}
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



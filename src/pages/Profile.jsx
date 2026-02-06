import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

// API helpers
import { get, put } from "../api/axiosConfig";
import { getUserPosts } from "../api/posts";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: "",
    socialLinks: {
      website: "",
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
  }, [user, navigate]);

  // Fetch profile & posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Backend returns { user }
        const res = await get("/users/profile");
        setProfile(res.user);

        setFormData({
          name: res.user.name || "",
          bio: res.user.bio || "",
          profilePic: res.user.profilePic || "",
          socialLinks: res.user.socialLinks || {
            website: "",
            twitter: "",
            linkedin: "",
            github: "",
          },
        });

        // ✅ Backend returns { posts }
        const userPosts = await getUserPosts();
        setPosts(userPosts.posts || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/register");
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["website", "twitter", "linkedin", "github"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Backend returns { user }
      const updatedRes = await put("/users/profile", formData);
      setProfile(updatedRes.user);
      setEditing(false);
      setSuccessMsg("✅ Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4" />
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  // Error
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
        {/* 👤 Profile Info */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold mb-2">
            {profile.name}'s Profile
          </h1>
          <p className="text-gray-600 mb-2">Email: {profile.email}</p>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              <input
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full border p-2 rounded"
              />
              <input
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                placeholder="Profile picture URL"
                className="w-full border p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                {["website", "twitter", "linkedin", "github"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={formData.socialLinks[field]}
                    onChange={handleChange}
                    placeholder={field}
                    className="w-full border p-2 rounded"
                  />
                ))}
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

              {successMsg && (
                <p className="text-green-600">{successMsg}</p>
              )}
            </form>
          ) : (
            <>
              {profile.bio && (
                <p className="text-gray-700 mt-2">
                  Bio: {profile.bio}
                </p>
              )}

              <img
                src={profile.profilePic || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full mt-3 object-cover"
              />

              {profile.socialLinks && (
                <div className="flex gap-4 mt-3 flex-wrap">
                  {Object.entries(profile.socialLinks).map(
                    ([key, value]) =>
                      value && (
                        <a
                          key={key}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {key}
                        </a>
                      )
                  )}
                </div>
              )}

              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* 📝 User Posts */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You haven't created any posts yet.
            </p>
          )}
        </div>

        {/* 🔔 Subscriptions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Your Subscriptions
          </h2>
          {profile.subscriptions?.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {profile.subscriptions.map((sub) => (
                <li key={sub._id}>
                  {sub.author ? (
                    <>
                      Author:{" "}
                      <Link
                        to={`/author/${sub.author._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {sub.author.name}
                      </Link>
                    </>
                  ) : (
                    <>
                      Category:{" "}
                      <Link
                        to={`/posts?category=${sub.category}`}
                        className="text-blue-600 hover:underline"
                      >
                        {sub.category}
                      </Link>
                    </>
                  )}
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
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import API, { get } from "../api/axiosConfig";  
import { getUserPosts } from "../api/users.js";
import { toast } from "react-toastify";

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

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await get("/auth/profile");
        console.log("Full API Response:", res);
        const profileUser = res.data.user;

        const finalUser = (profileUser && (profileUser._id || profileUser.id)) 
                          ? profileUser 
                          : user;

        if (!profileUser || (!profileUser._id && !profileUser.id)) {
          throw new Error("User profile or ID not found.");
        }

        setProfile(profileUser);
        setFormData({
          name: profileUser.name || "",
          bio: profileUser.bio || "",
          profilePic: profileUser.profilePic || "",
          socialLinks: profileUser.socialLinks || {
            website: "",
            twitter: "",
            linkedin: "",
            github: "",
          },
        });

        try {
          const rawPosts = await getUserPosts(profileUser._id);
          console.log("Posts response:", rawPosts);

          if (Array.isArray(rawPosts)) {
            const validPosts = rawPosts.filter(
              (post) => post && post._id && post.isDeleted !== true
            );
            setPosts(validPosts);
          }
        } catch (postErr) {
          console.error("Post fetch error:", postErr);
          toast.error("Could not load your posts.");
        }

      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to load profile.";
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files?.length > 0) {
      setFormData((prev) => ({ ...prev, profilePic: files[0] }));   //File input handling
    } else if (["website", "twitter", "linkedin", "github"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedRes;

      if (formData.profilePic instanceof File) {
        // File upload flow
        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("bio", formData.bio);
        formDataObj.append("profilePic", formData.profilePic);
        Object.keys(formData.socialLinks).forEach((key) => {
          formDataObj.append(`socialLinks[${key}]`, formData.socialLinks[key]);
        });

        updatedRes = await API.put("/auth/profile", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Cloudinary URL flow
        updatedRes = await API.put("/auth/profile", {
          name: formData.name,
          bio: formData.bio,
          profilePic: formData.profilePic,   //send URL directly
          socialLinks: formData.socialLinks,
        });
      }

      setProfile(updatedRes.data.user);
      setEditing(false);
      setSuccessMsg("✅ Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4" />
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        
        {/* PROFILE SECTION */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold mb-2">{profile?.name}'s Profile</h1>
          <p className="text-gray-600 mb-2">Email: {profile?.email}</p>

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

              {/* ✅ Cloudinary Upload Widget Button */}
              <button
                type="button"
                onClick={() => {
                  window.cloudinary.openUploadWidget(
                    {
                      cloudName: "djle175hb",        
                      uploadPreset: "profile_preset",  
                      sources: ["local", "url", "camera"],
                      multiple: false,
                      folder: "profile_pics",
                      cropping: true, // optional
                    },
                    (error, result) => {
                      if (!error && result.event === "success") {
                        setFormData((prev) => ({
                          ...prev,
                          profilePic: result.info.secure_url, // ✅ Cloudinary URL
                        }));
                      }
                    }
                  );
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Upload Profile Picture
              </button>

              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formData.socialLinks).map((field) => (
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
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
              {successMsg && <p className="text-green-600">{successMsg}</p>}
            </form>
          ) : (
            <>
              {profile?.bio && <p className="text-gray-700 mt-2">Bio: {profile.bio}</p>}
              <img 
                src={profile?.profilePic || "/default-avatar.png"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full mt-3 object-cover border"
                onError={(e) => { e.target.src = "/default-avatar.png"; }}
              />
              <button 
                onClick={() => setEditing(true)} 
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              >
                Edit Profile
              </button>

              {/* 🚫 Hide Subscribe button when viewing own profile */}
              {profile?._id !== user?._id && (
                <button
                  onClick={async () => {
                    try {
                      await API.post(`/subscriptions/author/${profile._id}`);
                      toast.success("Subscribed successfully");
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message || "Subscription failed"
                      );
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                >
                  Subscribe
                </button>
              )}
            </>
          )}
        </div>

        {/* POSTS SECTION */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't created any posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


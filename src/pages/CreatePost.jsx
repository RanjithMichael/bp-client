
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState(""); // message for non-logged-in users

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!title || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    const plainContent = content.replace(/<[^>]+>/g, "").trim();
    if (!plainContent || plainContent.length < 20) {
      newErrors.content = "Content must be at least 20 characters.";
    }

    if (!category || category.trim() === "") {
      newErrors.category = "Category is required.";
    }

    return newErrors;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setLoginMessage("⚠️ You must be logged in to create a post.");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await API.post(
        "/posts",
        {
          title,
          content,
          category,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      navigate("/"); // redirect after successful post
    } catch (err) {
      console.error("Post creation failed:", err);
      setErrors({ api: err.response?.data?.message || "Post creation failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📝 New Post</h1>

      {/* Login message for non-logged-in users */}
      {loginMessage && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-700 text-sm">
          {loginMessage}
        </div>
      )}

      {errors.api && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            placeholder="Enter a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
          <ReactQuill value={content} onChange={setContent} className="bg-white" />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            placeholder="e.g. Technology, Lifestyle"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            placeholder="e.g. react, tailwind, node (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

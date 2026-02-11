import { useState, useContext, useEffect } from "react";
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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // ✅ Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!title || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }
    const plainContent = content.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
    if (!plainContent || plainContent.length < 20) {
      newErrors.content = "Content must be at least 20 characters.";
    }
    if (!category || category.trim() === "") {
      newErrors.category = "Category is required.";
    }
    return newErrors;
  };

  // ✅ Upload image helper
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imageUrl;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setLoginMessage("⚠️ You must log in or register to create a post.");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      await API.post("/posts", {
        title,
        content,
        category,
        tags: tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
        image: imageUrl,
      });

      alert("✅ Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Post creation failed:", err);
      setErrors({ api: err.response?.data?.message || "Post creation failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl font-inter">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📝 New Post</h1>

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
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            readOnly={loading}
            className="bg-white"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            placeholder="e.g. Technology, Lifestyle"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            placeholder="e.g. react, tailwind, node (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-light transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
  
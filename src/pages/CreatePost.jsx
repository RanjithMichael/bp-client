import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Select, MenuItem } from "@mui/material"; //MUI multi-select

const categories = [
  "Technology",
  "Lifestyle",
  "Education",
  "Finance",
  "Travel",
  "Health",
];

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // IMAGE PREVIEW
  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  // TAG HANDLING
  const handleAddTag = (e) => {
  if (e.key === "Enter" && tagInput.trim()) {
    e.preventDefault();

    const newTag = tagInput.trim().toLowerCase();

    //prevent duplicates
    if (tags.includes(newTag)) {
      setTagInput("");
      return;
    }

    //limit tags (optional but recommended)
    if (tags.length >= 5) {
      alert("Maximum 5 tags allowed");
      return;
    }

    setTags((prev) => [...prev, newTag]); //safer update
    setTagInput("");
  }
};

const removeTag = (index) => {
  setTags((prev) => prev.filter((_, i) => i !== index)); //safer
};

  // VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!title || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    const plainContent = content
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, "")
      .trim();

    if (!plainContent || plainContent.length < 20) {
      newErrors.content = "Content must be at least 20 characters.";
    }

    if (!selectedCategories.length) {
      newErrors.category = "At least one category is required.";
    }

    return newErrors;
  };

  // IMAGE UPLOAD
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.imageUrl;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
  e.preventDefault();

  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  console.log("🧪 Token:", token);
  console.log("🧪 User:", user);

  if (!user || !token) {
    setLoginMessage("⚠️ Please login again to create a post.");
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
      console.log("📤 Uploading image...");
      imageUrl = await uploadImage(image);
      console.log("✅ Image uploaded:", imageUrl);
    }

    const payload = {
      title,
      content,
      categories: selectedCategories,
      tags,
      image: imageUrl,
    };

    console.log("📤 Sending post:", payload);

    const res = await API.post("/posts", payload);

    console.log("✅ Post created:", res.data);

    alert("✅ Post created successfully!");
    navigate("/");
  } catch (err) {
    console.error("❌ Create post error:", err);

    if (err.response?.status === 401) {
      setLoginMessage("⚠️ Session expired. Please login again.");
    }

    setErrors({
      api: err.response?.data?.message || "Post creation failed",
    });
  } finally {
    setLoading(false);
  }
};
  // UI
  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        ✍️ Create New Post
      </h1>

      {errors.api && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* TITLE */}
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* CONTENT */}
        <div>
          <label className="block mb-2 font-medium">Content</label>
          <ReactQuill value={content} onChange={setContent} />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block mb-2 font-medium">Categories</label>
          <Select
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(e.target.value)}
            className="w-full border rounded-lg"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* TAGS */}
        
<div>
  <label className="block mb-2 font-medium">
    Tags (Press Enter or comma)
  </label>

  <input
    type="text"
    placeholder="Type a tag and press Enter..."
    value={tagInput}
    onChange={(e) => setTagInput(e.target.value)}
    onKeyDown={handleAddTag}
    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
  />

  <div className="flex flex-wrap gap-2 mt-3">
    {tags.map((tag, index) => (
      <span
        key={index}
        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
      >
        {tag}
        <button
          type="button"
          onClick={() => removeTag(index)}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </span>
    ))}
  </div>
</div>

        {/* IMAGE */}
        <div>
          <label className="block mb-2 font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-3 rounded-lg"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

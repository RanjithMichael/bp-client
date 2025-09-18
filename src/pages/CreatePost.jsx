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
  const [errors, setErrors] = useState({});

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!title || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    // Strip HTML tags from content to check real length
    const plainContent = content.replace(/<[^>]+>/g, "").trim();
    if (!plainContent || plainContent.length < 20) {
      newErrors.content = "Content must be at least 20 characters.";
    }

    if (!category || category.trim() === "") {
      newErrors.category = "Category is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await API.post(
        "/posts",
        { title, content, category },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate("/"); // Redirect after successful creation
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Post creation failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        {/* Content */}
        <ReactQuill value={content} onChange={setContent} />
        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    image: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContentChange = (value) =>
    setForm({ ...form, content: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("⚠️ Login to create post");

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      };

      await API.post("/posts", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/");
    } catch (err) {
      console.error("❌ Error creating post:", err);
      alert("Failed to create post. Try again.");
    }
  };

  // ✅ Custom image handler for uploading files
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await API.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const imageUrl = res.data.url; // 

        // Insert uploaded image at current cursor position
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed!");
      }
    };
  };

  // ✅ Quill toolbar config with custom image handler
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet",
    "link", "image", "video",
  ];

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">📝 Create New Post</h2>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Enter post title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Category */}
        <input
          type="text"
          name="category"
          placeholder="Enter category (e.g. Tech, Travel)"
          value={form.category}
          onChange={handleChange}
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Enter tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Cover Image URL */}
        <input
          type="text"
          name="image"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={handleChange}
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Rich Text Editor */}
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={form.content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          className="h-72"
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200 self-end"
        >
          Publish 🚀
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

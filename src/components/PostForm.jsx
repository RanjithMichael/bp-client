import { useState } from "react";
import CategorySelector from "./CategorySelector";
import TagInput from "./TagInput";
import RichTextEditor from "./RichTextEditor";

export default function PostForm({ initialData = {}, onSubmit, loading }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [tags, setTags] = useState(initialData.tags || []);
  const [image, setImage] = useState(initialData.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, category, tags, image });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <CategorySelector value={category} onChange={setCategory} />
      <TagInput tags={tags} setTags={setTags} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
}

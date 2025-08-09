import { useState } from "react";

export default function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Tags</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-sm text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex mt-2 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="Add a tag"
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 flex-grow"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

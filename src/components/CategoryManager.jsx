import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.categories || res.data); 
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    try {
      const res = await API.post("/categories", { name: newCategory.trim() });
      const added = res.data.category || res.data; 
      setCategories([...categories, added]);
      setNewCategory("");
      setError(null);
    } catch (err) {
      console.error("Failed to add category:", err);
      setError("Failed to add category.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Manage Categories</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="border p-2 mr-2 rounded"
        placeholder="New category"
      />
      <button
        onClick={addCategory}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>

      {loading ? (
        <p className="mt-4">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="mt-4 text-gray-500">No categories yet.</p>
      ) : (
        <ul className="mt-4 list-disc pl-5">
          {categories.map((cat) => (
            <li key={cat._id || cat.id}>{cat.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
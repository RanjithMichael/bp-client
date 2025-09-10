import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    axios.get('/categories').then(res => setCategories(res.data));
  }, []);

  const addCategory = () => {
    axios.post('/categories', { name: newCategory }).then(res => {
      setCategories([...categories, res.data]);
      setNewCategory('');
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Manage Categories</h2>
      <input
        type="text"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
        className="border p-2 mr-2"
        placeholder="New category"
      />
      <button onClick={addCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
      <ul className="mt-4">
        {categories.map(cat => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
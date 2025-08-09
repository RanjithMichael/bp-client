export default function CategorySelector({ value, onChange }) {
  const categories = ["Technology", "Lifestyle", "Business", "Travel", "Food"];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

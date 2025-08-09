export default function RichTextEditor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows="8"
      placeholder="Write your post content here..."
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    ></textarea>
  );
}

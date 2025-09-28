import { useState } from "react";
import Search from "../components/Search";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="p-4 max-w-3xl mx-auto">
  <input
    type="text"
    placeholder="Search posts..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
  />
  <Search query={query} />
</div>
  );
}

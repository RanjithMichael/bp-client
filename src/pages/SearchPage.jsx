
import { useState, useEffect } from "react";
import Search from "../components/Search";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400); // adjust delay as needed
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search posts"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {debouncedQuery ? (
        <Search query={debouncedQuery} />
      ) : (
        <p className="text-gray-500 mt-4 text-center">
          Start typing to search posts...
        </p>
      )}
    </div>
  );
}
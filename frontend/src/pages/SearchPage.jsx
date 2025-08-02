import { useState } from "react";
import Post from "../components/Post";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const filter = {};
      if (query.trim()) filter.titleQuery = query.trim();
      if (tagQuery.trim()) filter.tag = tagQuery.trim();

      const res = await fetch("http://localhost:8082/posts/filtered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(filter),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to search posts");
      }

      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message || "Search failed");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-16 px-4 sm:px-0">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          🔎 Search Posts
        </h1>
        
        <form
          className="bg-gray-800 rounded-lg p-6 mb-6 flex flex-col gap-5 border border-gray-700"
          onSubmit={handleSearch}
        >
          <input
            className="p-2 rounded bg-gray-700 text-white outline-none"
            type="text"
            placeholder="Search by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="p-2 rounded bg-gray-700 text-white outline-none"
            type="text"
            placeholder="Search by tag (ex: javascript)"
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
          />
          <button
            className="bg-green-500 hover:bg-green-600 rounded-lg py-2 text-white font-semibold transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400 py-8">Loading results...</div>
        )}

        {!loading && searchResults.length === 0 && !error && (
          <div className="text-gray-400 text-center py-8">
            {query || tagQuery ? "No matching posts found" : "Enter search terms to find posts"}
          </div>
        )}

        <div className="space-y-6">
          {searchResults.map((result) => (
            <Post key={result.post.id} post={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
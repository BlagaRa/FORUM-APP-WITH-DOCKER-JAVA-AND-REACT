import { useState, useEffect } from "react";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8082/tags", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTags(data || []);
      } else {
        setError("Could not fetch tags.");
      }
    } catch {
      setError("Error loading tags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;
    setError("");

    try {
      const res = await fetch("http://localhost:8082/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newTag.trim() }),
      });
      if (res.ok) {
        setNewTag("");
        await fetchTags();
      } else {
        const text = await res.text();
        setError(text || "Failed to create tag.");
      }
    } catch {
      setError("Error creating tag.");
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Manage Tags</h2>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Filter tags"
            className="flex-grow p-2 rounded-l bg-gray-700 text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button
            onClick={() => setFilter("")}
            className="bg-gray-600 text-white px-4 rounded-r hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        <div className="flex mb-6">
          <input
            type="text"
            placeholder="New tag name"
            className="flex-grow p-2 rounded-l bg-gray-700 text-white"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            onClick={handleCreateTag}
            className="bg-green-600 px-4 rounded-r hover:bg-green-700 text-white"
          >
            Create
          </button>
        </div>

        {loading ? (
          <div className="text-gray-400 text-center">Loading tags...</div>
        ) : (
          <ul className="max-h-60 overflow-y-auto text-white">
            {filteredTags.length === 0 ? (
              <li className="text-gray-400 text-center">No tags found</li>
            ) : (
              filteredTags.map((tag) => (
                <li key={tag.id} className="border-b border-gray-700 py-2">
                  {tag.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagsPage;
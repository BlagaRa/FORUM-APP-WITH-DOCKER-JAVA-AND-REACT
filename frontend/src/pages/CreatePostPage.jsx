import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8083/users/id", {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setError("You must be logged in to create a post.");
          navigate("/login");
        }
      } catch {
        setError("Could not verify user. Please log in again.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Fetch tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://localhost:8082/tags", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setTags(data || []);
        } else {
          setError("Failed to fetch tags.");
        }
      } catch {
        setError("Error fetching tags.");
      }
    };

    fetchTags();
  }, []);

  // Handle toggling tag selection
  const handleTagToggle = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0] || null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard: NU trimite dacă deja e un submit în lucru!
    if (submitting) return;

    setSubmitting(true);
    setError("");

    if (!user) {
      setError("User not authenticated. Please log in.");
      setSubmitting(false);
      return;
    }

    if (!title.trim() || !text.trim()) {
      setError("Title and content cannot be empty.");
      setSubmitting(false);
      return;
    }

    try {
      let res;
      const postPayload = {
        title: title.trim(),
        text: text.trim(),
        authorId: user.id,
        tags: selectedTagIds.map((id) => ({ id })),
      };

      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append(
          "data",
          new Blob([JSON.stringify(postPayload)], {
            type: "application/json",
          })
        );

        res = await fetch("http://localhost:8082/posts/ph", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } else {
        res = await fetch("http://localhost:8082/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(postPayload),
        });
      }

      if (res.ok) {
        navigate("/home");
      } else {
        const msg = await res.text();
        setError(msg || "Could not create post.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-lg shadow-lg border border-gray-700"
        noValidate
      >
        <h2 className="text-2xl font-bold text-white mb-6">Create a New Post</h2>

        {error && (
          <div className="mb-4 text-red-500 bg-red-100 p-2 rounded">{error}</div>
        )}

        <label className="block mb-2 text-gray-300" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={submitting}
        />

        <label className="block mb-2 text-gray-300" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          required
          disabled={submitting}
        />

        <label className="block mb-2 text-gray-300">Tags</label>
        <div className="max-h-40 overflow-y-auto mb-4 bg-gray-700 p-2 rounded text-white">
          {tags.length === 0 ? (
            <div className="text-gray-400">No tags available.</div>
          ) : (
            tags.map((tag) => (
              <label
                key={tag.id}
                className="inline-flex items-center mr-4 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="mr-1"
                  disabled={submitting}
                />
                {tag.name}
              </label>
            ))
          )}
        </div>

        <label className="block mb-2 text-gray-300" htmlFor="photo">
          Image (optional)
        </label>
        <input
          id="photo"
          type="file"
          className="block mb-4 text-gray-200"
          accept="image/*"
          onChange={handlePhotoChange}
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold transition disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
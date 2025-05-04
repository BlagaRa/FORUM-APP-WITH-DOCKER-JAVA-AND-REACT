import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

// Ia toate comentariile pentru post
const fetchComments = async (postId) => {
  const res = await fetch("http://localhost:8082/posts/filtered", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ answerId: postId }),
  });
  if (!res.ok) throw new Error("Eroare la fetch comments");
  return await res.json();
};

// Adaugă un comentariu nou la postare
const addComment = async (postId) => {
    const body = {
      answerId: postId,
    };
    const res = await fetch("http://localhost:8082/posts/filtered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(
        {answerId:postId}
      )
    });
    console.log(body);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data || "Nu s-a putut adăuga comentariul");
    }
    return data;
  };

function renderReplies(comments, parentId) {
  const replies = comments.filter((c) => c.answerId === parentId);
  if (!replies.length) return null;
  return (
    <ul className="ml-6 border-l border-gray-600 pl-3">
      {replies.map((reply) => (
        <li key={reply.id ?? reply._id} className="mb-2">
          <div className="font-semibold text-xs text-green-300">
            {reply.author?.name || "Anonim"}
          </div>
          <div className="text-gray-300 mb-1">{reply.text }</div>
          {renderReplies(comments, reply.id ?? reply._id)}
        </li>
      ))}
    </ul>
  );
}

const CommentsDropdown = ({ postId }) => {
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshComments = () => {
    setLoading(true);
    fetchComments(postId)
      .then((data) => {
        console.log("Fetched comments:", data);
        setComments(data);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (show) {
      refreshComments();
    }
    // eslint-disable-next-line
  }, [show, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setAddLoading(true);
    setError("");
    try {
      await addComment(postId, newComment.trim());
      setNewComment("");
      refreshComments();
    } catch (err) {
      setError(err.message || "Eroare la adăugare comentariu");
      console.log(err);
    } finally {
      setAddLoading(false);
    }
  };

  const topLevelComments = comments.filter(
    (c) => c.answerId === postId
  );

  return (
    <div>
      <button
        onClick={() => setShow((v) => !v)}
        className={`p-2 rounded-full hover:bg-gray-700 transition mt-3 flex items-center group ${
          show ? "bg-gray-800" : ""
        }`}
        aria-label={show ? "Ascunde comentariile" : "Vezi comentariile"}
        type="button"
      >
        <MessageCircle
          size={26}
          color={show ? "#22d3ee" : "#fff"}
          className="transition group-hover:scale-110"
        />
        <span className="ml-2 text-gray-200 font-medium text-base">
          {topLevelComments.length}
        </span>
      </button>
      {show && (
        <div className="border mt-4 border-gray-700 bg-gray-900 rounded p-4">

          <form onSubmit={handleSubmit} className="mb-4 flex flex-col">
            <textarea
              className="resize-none p-2 mb-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
              placeholder="Adaugă un comentariu..."
              value={newComment}
              maxLength={500}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={addLoading}
            />
            <button
              disabled={addLoading || !newComment.trim()}
              type="submit"
              className={`self-end bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500 transition ${
                addLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {addLoading ? "Se trimite..." : "Trimite"}
            </button>
            {error && <div className="text-red-400 text-xs">{error}</div>}
          </form>

          {loading && <div className="text-gray-400 mb-2">Se încarcă...</div>}
          {!loading && topLevelComments.length === 0 && (
            <div className="text-gray-400 mb-2">Nu există comentarii!</div>
          )}
          {!loading && topLevelComments.length > 0 && (
            <ul>
              {topLevelComments.map((comment) => (
                <li key={comment.id ?? comment._id} className="mb-4">
                  <div className="font-semibold text-green-400">
                    {comment.author?.name || "Anonim"}
                  </div>
                  <div className="text-gray-200 mb-1">
                    {comment.text || comment.titleQuerry}
                  </div>
                  {renderReplies(comments, comment.id ?? comment._id)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentsDropdown;
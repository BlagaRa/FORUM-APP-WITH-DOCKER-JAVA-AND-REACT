import { useState, useEffect, useRef } from "react";
import { Heart, ThumbsDown, MoreVertical } from "lucide-react";
import CommentsDropdown from "./CommentsDropdown";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return !isNaN(d) ? d.toLocaleString() : "";
}

const Post = ({ post, onDelete, onEdit, deleting }) => {
  // Like/Dislike state management
  const [isLiked, setIsLiked] = useState(post.action != null && post.action.action > 0);
  const [isDisliked, setIsDisliked] = useState(post.action != null && post.action.action < 0);
  const [likesCount, setLikesCount] = useState(post.post.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(post.post.dislikes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLiked(post.action != null && post.action.action > 0);
    setIsDisliked(post.action != null && post.action.action < 0);
    setLikesCount(post.post.likes || 0);
    setDislikesCount(post.post.dislikes || 0);
  }, [post]);

  // Dropdown & modal states
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal Edit states
  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(post.post.title || "");
  const [editPicture, setEditPicture] = useState(post.post.picture || "");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchPost = async (postId) => {
    try {
      const res = await fetch("http://localhost:8082/posts/filtered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const updatedPosts = await res.json();
        const updatedPost = updatedPosts.find((p) => p.post.id === postId);
        if (updatedPost) {
          return {
            liked: updatedPost.action != null && updatedPost.action.action > 0,
            likes: updatedPost.post.likes || 0,
            disliked: updatedPost.action != null && updatedPost.action.action < 0,
            dislikes: updatedPost.post.dislikes || 0,
          };
        }
      }
      throw new Error("Failed to fetch updated post");
    } catch (err) {
      console.error("Error fetching post:", err);
      throw err;
    }
  };

  const updateAction = async (postId, actionType, activate) => {
    const method = activate ? "POST" : "DELETE";
    const body = JSON.stringify(
      method === "POST" ? { postId, userId: post.post.author.id, action: actionType } : { postId, userId: post.post.author.id }
    );
    const url = "http://localhost:8082/actions";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });

      if (res.ok) {
        return await fetchPost(postId);
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to update action");
      }
    } catch (err) {
      console.error(`Error updating action (${actionType}):`, err);
      throw err;
    }
  };

  const handleLikeClick = async () => {
  if (isLiking || isDisliking) return;
  setIsLiking(true);
  setError(null);

  // Optimistic update
  const wasLiked = isLiked;
  const wasDisliked = isDisliked;
  
  const newLikesCount = wasLiked ? likesCount - 1 : likesCount + 1;
  const newDislikesCount = wasDisliked ? dislikesCount - 1 : dislikesCount;
  
  setIsLiked(!wasLiked);
  setLikesCount(newLikesCount);
  setIsDisliked(false);
  setDislikesCount(newDislikesCount);

  try {
    if (wasDisliked) {
      await updateAction(post.post.id, -1, false);
    }
    await updateAction(post.post.id, 1, !wasLiked);
    
    // Optional: confirm with server
    const result = await fetchPost(post.post.id);
    if (result) {
      setIsLiked(result.liked);
      setLikesCount(result.likes);
      setIsDisliked(result.disliked);
      setDislikesCount(result.dislikes);
    }
  } catch (err) {
    // Revert on error
    setIsLiked(wasLiked);
    setLikesCount(likesCount);
    setIsDisliked(wasDisliked);
    setDislikesCount(dislikesCount);
    
    setError(err.message || "Failed to update like. Please try again.");
  } finally {
    setIsLiking(false);
  }
};

  const handleDislikeClick = async () => {
    if (isLiking || isDisliking) return;
    setIsDisliking(true);
    setError(null);

    try {
      if (!isDisliked) {
        if (isLiked) {
          await updateAction(post.post.id, 1, false);
        }
        const result = await updateAction(post.post.id, -1, true);
        if (result) {
          setIsDisliked(result.disliked);
          setDislikesCount(result.dislikes);
          setIsLiked(result.liked);
          setLikesCount(result.likes);
        }
      } else {
        const result = await updateAction(post.post.id, -1, false);
        if (result) {
          setIsDisliked(result.disliked);
          setDislikesCount(result.dislikes);
          setIsLiked(result.liked);
          setLikesCount(result.likes);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to update dislike. Please try again.");
    } finally {
      setIsDisliking(false);
    }
  };

  // --- Handle Edit Modal
  const handleEditSave = async () => {
  setSavingEdit(true);
  setEditError(null);
  try {
    if (!editTitle.trim()) {
      setEditError("Title cannot be empty.");
      setSavingEdit(false);
      return;
    }
    if (onEdit) {
      await onEdit(post.post.id, {
        title: editTitle,
        picture: editPicture 
      });
      setShowEdit(false);
    }
  } catch (err) {
    setEditError(err.message || "Error editing post");
  } finally {
    setSavingEdit(false);
  }
};
  // ---

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg border border-gray-700 max-w-xl mx-auto relative">
      {/* MENU: 3 points for edit/delete, only if props present */}
      {/* MENU: 3 points for edit/delete, only if props present */}
{(onDelete || onEdit) && (
  <div className="absolute left-4 bottom-4 z-20" ref={menuRef}>
    <button
      className="p-2 rounded-full hover:bg-gray-700"
      onClick={() => setShowMenu(v => !v)}
      aria-label="Post options"
      // Eliminați ascunderea pe hover: meniul e mereu vizibil aici
    >
      <MoreVertical color="#aaa" />
    </button>
    {showMenu && (
      <div className="absolute right-0 bottom-10 bg-gray-900 border border-gray-700 shadow rounded text-sm overflow-hidden z-30 min-w-[8rem]">
        {onEdit && (
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-800"
            onClick={() => { setShowEdit(true); setShowMenu(false); }}
          >Edit</button>
        )}
        {onDelete && (
          <button
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800"
            onClick={() => { setShowMenu(false); onDelete(post.post.id); }}
            disabled={deleting}
          >{deleting ? "Deleting..." : "Delete"}</button>
        )}
      </div>
    )}
  </div>
)}
      {/* TIMPUL in dreapta sus */}
      {post.post.dateTime && (
        <div className="absolute top-4 right-6 text-xs text-gray-400 italic">
          {formatDate(post.post.dateTime)}
        </div>
      )}

      <div className="flex items-center mb-3">
        <img
          src={post.post.author?.picture || "/default-avatar.png"}
          alt="Author avatar"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <div className="font-bold text-green-400 text-lg">{post.post.author?.name || "Unknown Author"}</div>
        </div>
      </div>
      <hr className="mb-4 border-gray-600" />
      <h2 className="text-xl font-bold text-white mb-2">{post.post.title || "Untitled"}</h2>
      {post.post.picture && (
        <img src={post.post.picture} alt="Post" className="w-full max-h-72 object-cover rounded-lg mb-3" />
      )}
      <p className="text-gray-300 mb-2">{post.post.text || "No content"}</p>

      {/* TAGS */}
      {post.post.tags && post.post.tags.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.post.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-green-700 text-green-100 px-3 py-1 rounded-full text-xs font-semibold shadow"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : (
        <div className="mb-4 text-xs text-gray-400 italic">No tags</div>
      )}

      {error && <div className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded">{error}</div>}

      <div className="flex items-center space-x-4 text-gray-400 text-lg mt-2">
        <button
          onClick={handleLikeClick}
          className={`transition hover:scale-110 focus:outline-none p-1 rounded-full ${
            isLiking ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLiking}
          title={isLiked ? "Unlike this post" : "Like this post"}
        >
          <Heart
            fill={isLiked ? "#ef4444" : "none"}
            color={isLiked ? "#ef4444" : "#fff"}
            size={28}
            strokeWidth={2.3}
          />
        </button>
        <div className="font-medium">
          {likesCount} Like{likesCount === 1 ? "" : "s"}
        </div>
        <button
          onClick={handleDislikeClick}
          className={`transition hover:scale-110 focus:outline-none p-1 rounded-full ${
            isDisliking ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isDisliking}
          title={isDisliked ? "Undislike this post" : "Dislike this post"}
        >
          <ThumbsDown
            fill={isDisliked ? "#3b82f6" : "none"}
            color={isDisliked ? "#3b82f6" : "#fff"}
            size={28}
            strokeWidth={2.3}
          />
        </button>
        <div className="font-medium">
          {dislikesCount} Dislike{dislikesCount === 1 ? "" : "s"}
        </div>
        <CommentsDropdown postId={post.post.id} />
      </div>

      {/* STATUS jos */}
      <div className="mt-6 text-right">
        <span
          className={`inline-block px-4 py-1 rounded-full text-xs font-semibold shadow ${
            post.post.status === "Just Posted"
              ? "bg-green-700 text-green-200"
              : post.post.status === "In Progress"
              ? "bg-blue-700 text-blue-200"
              : post.post.status === "Solved"
              ? "bg-purple-700 text-purple-200"
              : "bg-gray-700 text-yellow-300"
          }`}
        >
          {post.post.status || "No Status"}
        </span>
      </div>
      {/* MODAL de EDITARE */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-70">
          <div className="bg-gray-800 rounded-lg p-6 shadow relative w-full max-w-lg border border-gray-700">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowEdit(false)}>
              ✖
            </button>
            <div className="mb-3 text-lg font-bold text-green-300">Edit Post</div>
            <div>
              <label className="block text-green-100 text-sm mb-1">Title</label>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 mb-3 bg-gray-900 rounded border border-gray-700 text-white"
                disabled={savingEdit}
                autoFocus
              />
            </div>
            <div>
  <label className="block text-green-100 text-sm mb-1">Imagine</label>
  <input
    type="file"
    accept="image/*"
    className="w-full mb-3"
    disabled={savingEdit}
    onChange={async (e) => {
      if (e.target.files && e.target.files[0]) {
        setEditPicture(e.target.files[0]);
      }
    }}
  />
  {editPicture && typeof editPicture !== "string" && (
    <img
      src={URL.createObjectURL(editPicture)}
      alt="Preview"
      className="w-full mt-2 rounded max-h-48 object-cover border border-gray-700"
    />
  )}
  {editPicture && typeof editPicture === "string" && (
    <img
      src={editPicture}
      alt="Preview"
      className="w-full mt-2 rounded max-h-48 object-cover border border-gray-700"
    />
  )}
</div>
            {editError && (
              <div className="text-red-500 text-sm mt-2">{editError}</div>
            )}
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 rounded bg-gray-700 text-gray-200">
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={savingEdit}
                className={`px-4 py-2 rounded bg-green-600 text-white font-bold ${savingEdit && 'opacity-50 cursor-not-allowed'}`}
              >
                {savingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Post;
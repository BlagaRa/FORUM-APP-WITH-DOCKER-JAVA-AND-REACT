import { useState, useEffect } from "react";
import { Heart, ThumbsDown } from "lucide-react";
import CommentsDropdown from "./CommentsDropdown";
const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser ?? false);
  const [isDisliked, setIsDisliked] = useState(post.dislikedByCurrentUser ?? false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLiked(post.likedByCurrentUser ?? false);
    setIsDisliked(post.dislikedByCurrentUser ?? false);
    setLikesCount(post.likes || 0);
    setDislikesCount(post.dislikes || 0);
  }, [post]);

  // Fetch post again for the updated state
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
            liked: updatedPost.post.likedByCurrentUser ?? false,
            likes: updatedPost.post.likes || 0,
            disliked: updatedPost.post.dislikedByCurrentUser ?? false,
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
      method === "POST" ? { postId, userId: post.id, action: actionType } : { postId, userId: post.id }
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

    try {
      if (!isLiked) {
        if (isDisliked) {
          await updateAction(post.id, -1, false);
        }
        const result = await updateAction(post.id, 1, true);
        if (result) {
          setIsLiked(result.liked);
          setLikesCount(result.likes);
          setIsDisliked(result.disliked);
          setDislikesCount(result.dislikes);
        }
      } else {
        const result = await updateAction(post.id, 1, false);
        if (result) {
          setIsLiked(result.liked);
          setLikesCount(result.likes);
          setIsDisliked(result.disliked);
          setDislikesCount(result.dislikes);
        }
      }
    } catch (err) {
      console.log(err.message || "Failed to update like. Please try again.");
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
          await updateAction(post.id, 1, false);
        }
        const result = await updateAction(post.id, -1, true);
        if (result) {
          setIsDisliked(result.disliked);
          setDislikesCount(result.dislikes);
          setIsLiked(result.liked);
          setLikesCount(result.likes);
        }
      } else {
        const result = await updateAction(post.id, -1, false);
        if (!result) {
          setIsDisliked(result.disliked);
          setDislikesCount(result.dislikes);
          setIsLiked(result.liked);
          setLikesCount(result.likes);
        }
      }
    } catch (err) {
      console.log(err.message || "Failed to update dislike. Please try again.");
    } finally {
      setIsDisliking(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg border border-gray-700 max-w-xl mx-auto">
      <div className="flex items-center mb-3">
        <img
          src={post.author?.pictures || "/default-avatar.png"}
          alt="Author avatar"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <div className="font-bold text-green-400 text-lg">{post.author?.name || "Unknown Author"}</div>
        </div>
      </div>
      <hr className="mb-4 border-gray-600" />
      <h2 className="text-xl font-bold text-white mb-2">{post.title || "Untitled"}</h2>
      {post.picture && (
        <img src={post.picture} alt="Post" className="w-full max-h-72 object-cover rounded-lg mb-3" />
      )}
      <p className="text-gray-300 mb-4">{post.text || "No content"}</p>
      {error && <div className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded">{error}</div>}
      <div className="flex items-center space-x-4 text-gray-400 text-lg mt-2">
        <button
          onClick={handleLikeClick}
          className={`transition hover:scale-110 focus:outline-none p-1 rounded-full ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
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
        <div className="font-medium">{likesCount} Like{likesCount === 1 ? "" : "s"}</div>
        <button
          onClick={handleDislikeClick}
          className={`transition hover:scale-110 focus:outline-none p-1 rounded-full ${isDisliking ? "opacity-50 cursor-not-allowed" : ""}`}
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
        <div className="font-medium">{dislikesCount} Dislike{dislikesCount === 1 ? "" : "s"}</div>
      </div>
      <CommentsDropdown postId={post.id} />
      
    </div>
  );
};

export default Post;
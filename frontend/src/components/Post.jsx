import { useState } from "react";
import { Heart } from "lucide-react";

const Post = ({ post, onLike }) => {
  const initialLiked = post.post.likedByCurrentUser ?? false;
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.post.likes || 0);

  const handleLikeClick = async () => {
    // trimite la parent, primește noua stare
    if (onLike) {
      const result = await onLike(post.post.id, isLiked);
      if (result && typeof result.liked === "boolean") {
        setIsLiked(result.liked);
        setLikesCount((old) =>
          result.liked ? old - 1 : old + 1
        );
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg border border-gray-700 max-w-xl mx-auto">
      <div className="flex items-center mb-3">
        <img src={post.post.author.picture || "/default-avatar.png"} alt="author" className="w-12 h-12 rounded-full mr-3" />
        <div>
          <div className="font-bold text-green-400 text-lg">{post.post.author.name}</div>
        </div>
      </div>
      <hr className="mb-4 border-gray-600" />
      <h2 className="text-xl font-bold text-white mb-2">{post.post.title}</h2>
      {post.post.picture && <img src={post.post.picture} alt="Post" className="w-full max-h-72 object-cover rounded-lg mb-3" />}
      <p className="text-gray-300 mb-4">{post.post.text}</p>
      <div className="flex items-center space-x-2 text-gray-400 text-lg mt-2">
        <button
          onClick={handleLikeClick}
          className="transition hover:scale-110 focus:outline-none p-1 rounded-full"
          title={post.action != null && post.action.action == 1 ? "Anulează like-ul" : "Like"}
        >
          <Heart
            fill={post.action != null && post.action.action == 1 ? "#ef4444" : "none"}
            color={post.action != null && post.action.action == 1 ? "#ef4444" : "#fff"}
            className="inline"
            size={28}
            strokeWidth={2.3}
          />
        </button>
        <div className="font-medium">{likesCount} Like{likesCount === 1 ? "" : "s"}</div>
      </div>
    </div>
  );
};

export default Post;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const ProfilePage = ({ currentUser }) => {
  const { userId } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingPostIds, setDeletingPostIds] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [followError, setFollowError] = useState(null);

  const isMyProfile = currentUser && profileUser && currentUser.id === profileUser.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      const idToFetch = userId || (currentUser ? currentUser.id : null);

      if (!idToFetch) {
        setError("No user ID provided and current user is not available.");
        setLoading(false);
        return;
      }

      try {
        const userUrl = userId
          ? `http://localhost:8083/users/${userId}`
          : `http://localhost:8083/users/id`;
        const userRes = await fetch(userUrl, { credentials: "include" });

        if (!userRes.ok) {
          const errorText = await userRes.text();
          throw new Error(errorText || `Failed to fetch profile user (status: ${userRes.status})`);
        }
        const userData = await userRes.json();
        setProfileUser(userData);

        const postsResp = await fetch("http://localhost:8082/posts/filtered", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.id }),
        });

        if (postsResp.ok) {
          const postsData = await postsResp.json();
          setMyPosts(
            postsData
              .filter((item) => item.post.author && item.post.author.id === userData.id)
              .sort((a, b) => new Date(b.post.createdAt) - new Date(a.post.createdAt))
          );
        } else {
          setMyPosts([]);
        }

        if (currentUser && userData.id !== currentUser.id) {
          setIsFollowing(userData.isFollowingByCurrentUser ?? false);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        setError(err.message || "Failed to load profile data.");
        setProfileUser(null);
        setMyPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    // eslint-disable-next-line
  }, [userId, currentUser]);

  // Ștergere postare
  const handleDeletePost = async (postId) => {
    const postToDelete = myPosts.find((p) => p.post.id === postId);
    if (!isMyProfile || !postToDelete || postToDelete.post.author.id !== currentUser.id) {
      alert("You cannot delete this post.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post forever?")) {
      return;
    }

    try {
      setDeletingPostIds((prev) => [...prev, postId]);
      const res = await fetch(`http://localhost:8082/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete post");
      }

      setMyPosts((prev) => prev.filter((item) => item.post.id !== postId));
    } catch (err) {
      alert(err.message || "Error deleting post.");
    } finally {
      setDeletingPostIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  // Editare postare (titlu și poză)
  const handleEditPost = async (postId, update) => {
  const postToEdit = myPosts.find((p) => p.post.id === postId);
  if (!isMyProfile || !postToEdit || postToEdit.post.author.id !== currentUser.id)
    throw new Error("Not authorized to edit this post");

  
    let body, headers;
    if (update.picture instanceof File) {
      body = new FormData();
      body.append("title", update.title);
      body.append("picture", update.picture);
      headers = {}; // Lasă browserul să adauge boundary header
    } else {
      body = JSON.stringify({
        id: postId,
        title: update.title,
        picture: update.picture
      });
      headers = { "Content-Type": "application/json" };
    }
    const res = await fetch(`http://localhost:8082/posts`, {
      method: "PATCH", 
      credentials: "include",
      headers,
      body,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to update post");
    }
    // Assume backend returns updated post
    const updatedPost = update.picture instanceof File ? await res.json() : { ...postToEdit.post, ...update };
    setMyPosts((prev) =>
      prev.map((item) =>
        item.post.id === postId
          ? { ...item, post: updatedPost }
          : item
      )
    );
  
};

  // Follow/Unfollow
  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser || isFollowingLoading) return;

    setIsFollowingLoading(true);
    setFollowError(null);
    const targetUserId = profileUser.id;

    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`http://localhost:8083/follow/${targetUserId}`, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Failed to ${isFollowing ? "unfollow" : "follow"} user (status: ${res.status})`);
      }

      setIsFollowing(!isFollowing);
    } catch (err) {
      setFollowError(err.message || `Failed to ${isFollowing ? "unfollow" : "follow"}. Please try again.`);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300 py-8">Loading profile...</div>;
  }

  if (error || !profileUser) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading profile: {error || "Profile not found or data is incomplete."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      {/* Secțiune Profil */}
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700 w-full max-w-lg mb-8 mt-6 relative">
        {/* Scor în colțul dreapta sus */}
        {profileUser.score !== undefined && (
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-gray-700 px-3 py-1 rounded-full shadow text-yellow-300 font-bold text-lg z-10">
            <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975 4.18.013c.969.003 1.371 1.25.588 1.81l-3.388 2.517 1.272 3.982c.285.893-.755 1.631-1.538 1.08l-3.322-2.423-3.322 2.423c-.782.55-1.823-.187-1.538-1.08l1.272-3.982-3.388-2.517c-.783-.56-.38-1.807.588-1.81l4.18-.013 1.286-3.975z"/>
            </svg>
            <span>{profileUser.score}</span>
          </div>
        )}

        <div className="flex flex-col items-center">
          <img
            src={profileUser.picture || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-green-400 object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-white">{profileUser.name || "User"}</h2>
          <div className="text-gray-400">{profileUser.email || "No Email"}</div>
        </div>

        {/* Buton Follow/Unfollow */}
        {!isMyProfile && currentUser && (
          <div className="absolute top-14 right-4">
            {followError && <div className="text-red-500 text-xs mb-1">{followError}</div>}
            <button
              onClick={handleFollowToggle}
              disabled={isFollowingLoading}
              className={`px-4 py-2 text-sm font-semibold rounded transition-colors duration-200 ${
                isFollowingLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : isFollowing
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isFollowingLoading
                ? "Loading..."
                : isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
          </div>
        )}
      </div>

      {/* Postări */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold text-green-300 mb-5 text-center">
          {isMyProfile ? "My Posts" : `${profileUser.name || "User"}'s Posts`}
        </h2>
        {myPosts.length === 0 ? (
          <div className="text-gray-400 text-center">
            {isMyProfile
              ? "You haven't created any posts yet."
              : `${profileUser.name || "User"} hasn't created any posts yet.`}
          </div>
        ) : (
          <div className="space-y-6">
            {myPosts.map((post) => (
              <Post
                key={post.post.id}
                post={post}
                onDelete={isMyProfile ? handleDeletePost : undefined}
                onEdit={isMyProfile ? handleEditPost : undefined}
                deleting={isMyProfile && deletingPostIds.includes(post.post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
import { useEffect, useState } from "react";
import Post from "../components/Post";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8083/users/id", {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          // requset only user's own posts!
          const postsResp = await fetch("http://localhost:8082/posts/filtered", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userData.id }),
          });
          if (postsResp.ok) {
            const postsData = await postsResp.json();
            // SAFETY: filtrez local dacă e nevoie (doar dacă backend nu filtrează, șterge linia dacă backend e bun!)
            const justMine = postsData.map((p) => p.post).filter(post => post.author.id === userData.id);
            setMyPosts(justMine);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  if (loading) return <div className="text-center text-gray-300 py-8">Loading profile...</div>;
  if (!user) return <div className="text-center text-red-500">Error loading profile</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700 w-full max-w-lg mb-8 mt-6">
        <div className="flex flex-col items-center">
          <img
            src={user.picture || "/default-avatar.png"}
            className="w-24 h-24 rounded-full border-2 border-green-400 object-cover mb-4"
            alt="Profile"
          />
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <div className="text-gray-400">{user.email}</div>
        </div>
      </div>
      {/* Postările userului */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold text-green-300 mb-5 text-center">My Posts</h2>
        {myPosts.length === 0 ? (
          <div className="text-gray-400 text-center">No posts yet.</div>
        ) : (
          myPosts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
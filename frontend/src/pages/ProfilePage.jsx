import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8083/users/id', {
          credentials: 'include',
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="text-center text-gray-300 py-8">Loading profile...</div>;
  if (!user) return <div className="text-center text-red-500">Error loading profile</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700 w-full max-w-lg">
        <div className="flex flex-col items-center">
          <img
            src={user.picture || '/default-avatar.png'}
            className="w-24 h-24 rounded-full border-2 border-green-400 object-cover mb-4"
            alt="Profile"
          />
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <div className="text-gray-400">{user.email}</div>
        </div>
        {/* Optionally: add list of user's posts, stats, edit profile, etc */}
      </div>
    </div>
  );
};

export default ProfilePage;
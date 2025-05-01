import { useEffect, useState } from "react";

const AdminUsersPage = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8083/users", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data || []);
      } else {
        setError("No permission or failed to fetch users.");
      }
    } catch{
      setError("Could not fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // (Un)Ban user
  const handleBanToggle = async (user) => {
    if (user.id === currentUser?.id) {
      alert("You cannot ban yourself!");
      return;
    }
    setError("");
    const res = await fetch(`http://localhost:8081/ban/${user.id}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      fetchUsers();
    } else {
      const text = await res.text();
      setError(text || "Failed to ban/unban user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Admin: Manage Users
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {loading ? (
          <div className="text-gray-400 text-center">Loading users...</div>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr>
                <th className="py-2 text-left">Profile</th>
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Email</th>
                <th className="py-2 text-center">Ban Status</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-700">
                  <td className="py-2">
                    <img
                      src={u.picture || "/default-avatar.png"}
                      alt={u.name}
                      className="w-10 h-10 rounded-full border border-gray-500 object-cover"
                    />
                  </td>
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2 text-center">
                    {u.isBanned ? (
                      <span className="text-red-400">Banned</span>
                    ) : (
                      <span className="text-green-400">Active</span>
                    )}
                  </td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => handleBanToggle(u)}
                      className={
                        "px-4 py-1 rounded-lg " +
                        (u.isBanned
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700") +
                        " text-white font-semibold"
                      }
                    >
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
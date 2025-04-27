import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8081/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        document.cookie = "jwToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUser(null);
        navigate("/login");
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold text-green-400 tracking-wide">
          ForumHub
        </Link>
        <Link
          to="/post"
          className="px-4 py-2 border-2 border-blue-900 text-white rounded-lg hover:bg-blue-900 hover:text-white transition"
        >
          Create + Post
        </Link>
        <div className="flex space-x-8 text-lg">
          <Link
            to="/categories"
            onClick={(e) => handleProtectedClick(e, "/categories")}
            className="hover:text-green-400 transition"
          >
            Categories
          </Link>
          <Link
            to="/discussions"
            onClick={(e) => handleProtectedClick(e, "/discussions")}
            className="hover:text-green-400 transition"
          >
            Discussions
          </Link>
          <Link
            to="/members"
            onClick={(e) => handleProtectedClick(e, "/members")}
            className="hover:text-green-400 transition"
          >
            Members
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          {/* SEARCH ICON (Only for Logged In Users) */}
          {user && (
            <button className="hover:text-green-400 transition" title="Search (coming soon)">
              <Search size={22} />
            </button>
          )}
          {/* USER PROFILE SECTION (If Logged In) */}
          {user ? (
            <button
              className="flex items-center space-x-2 hover:text-green-400 transition"
              onClick={() => navigate('/profile')}
            >
              <img
                src={user.picture || '/default-avatar.png'}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-600 object-cover"
              />
              <span>{user.name}</span>
            </button>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 border border-green-400 rounded-lg hover:bg-green-500 transition"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
              >
                <UserPlus size={18} /> Sign Up
              </Link>
            </div>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
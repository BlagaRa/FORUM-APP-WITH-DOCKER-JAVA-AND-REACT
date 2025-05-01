import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  PlusSquare,
  Tag,
  Search,
  Users,
  MessageCircle,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';

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

  // stil pentru icon și text
  const menuItem =
    'flex items-center gap-3 px-5 py-3 transition rounded-lg hover:bg-blue-900 text-lg font-medium';

  // fixare sidebar
  return (
    <nav className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between z-40">
      <div>
        {/* LOGO */}
        <div className="flex items-center px-7 py-7 mb-6">
          <Link to="/home" className="flex items-center gap-2 text-3xl font-bold text-green-400 tracking-wide">
             ForumHub
          </Link>
        </div >
        {user && user.isAdmin && (
          <div className="flex flex-col space-y-2 text-green-400 ">
          <li>
            <Link to="/admin/users" className={menuItem}>
              <Users size={22} /> Admin Users
            </Link>
          </li>
          </div>
          )}
        {/* MENIU */}
        <ul className="flex flex-col space-y-2 text-green-400 ">
          <li>
            <Link to="/home" className={menuItem}>
              <Home size={22} /> Home
            </Link>
          </li>
          <li>
            <Link to="/post" className={menuItem}>
              <PlusSquare size={22} /> Create Post
            </Link>
          </li>
          <li>
            <Link to="/tags" className={menuItem}>
              <Tag size={22} /> Create Tags
            </Link>
          </li>
          <li>
            <button className={menuItem} disabled>
              <Search size={22} /> Search (soon)
            </button>
          </li>
          <li>
            <Link to="/categories" className={menuItem}>
              <Tag size={22} /> Categories
            </Link>
          </li>
          <li>
            <Link to="/discussions" className={menuItem}>
              <MessageCircle size={22} /> Discussions
            </Link>
          </li>
          <li>
            <Link to="/members" className={menuItem}>
              <Users size={22} /> Members
            </Link>
          </li>
        </ul>
      </div>
      {/* PROFIL + LOGOUT jos */}
      <div className="mb-8 px-7">
        {user ? (
          <div className="flex flex-col gap-3">
            <button
              className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition"
              onClick={() => navigate('/profile')}
            >
              <img
                src={user.picture || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-600 object-cover"
              />
              <span className="font-semibold text-white">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition mt-1"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
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
      </div>
    </nav>
  );
};

export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  // Simulated authentication state (Replace with real auth logic)
  const user = null; // Change this to `{ name: "John Doe", avatar: "URL" }` when logged in

  // If user is not logged in, force them to login for forum access
  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault(); // Prevent navigation
      navigate("/login"); // Redirect to login
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-green-400 tracking-wide">
          ForumHub
        </Link>

        {/* NAV LINKS (Users Must Be Logged In) */}
        <div className="flex space-x-8 text-lg">
          <Link to="/categories" onClick={(e) => handleProtectedClick(e, "/categories")} className="hover:text-green-400 transition">Categories</Link>
          <Link to="/discussions" onClick={(e) => handleProtectedClick(e, "/discussions")} className="hover:text-green-400 transition">Discussions</Link>
          <Link to="/members" onClick={(e) => handleProtectedClick(e, "/members")} className="hover:text-green-400 transition">Members</Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-6">
          
          {/* SEARCH ICON (Only for Logged In Users) */}
          {user && (
            <button className="hover:text-green-400 transition">
              <Search size={22} />
            </button>
          )}

          {/* USER PROFILE SECTION (If Logged In) */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-green-400 transition">
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border border-gray-600" />
                <ChevronDown size={18} />
              </button>

              {/* DROPDOWN MENU */}
              <div className="absolute hidden group-hover:block right-0 mt-2 w-44 bg-gray-800 shadow-lg rounded-md border border-gray-700">
                <div className="px-4 py-2 text-gray-300">{user.name}</div>
                <hr className="border-gray-600" />
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 transition">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 transition">Settings</Link>
                <hr className="border-gray-600" />
                <Link to="/logout" className="block px-4 py-2 hover:bg-red-600 transition">Logout</Link>
              </div>
            </div>
          ) : (
            // LOGIN/SIGNUP IF NOT LOGGED IN
            <div className="flex space-x-4">
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 border border-green-400 rounded-lg hover:bg-green-500 transition">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/signup" className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
                <UserPlus size={18} /> Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

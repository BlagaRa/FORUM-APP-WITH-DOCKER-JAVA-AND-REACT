import LoginPage from './Pages/LoginPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Navbar from './components/Navbar.jsx';
import { useEffect, useState } from 'react';
import ProfilePage from './pages/ProfilePage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import AccountBannedPage from './components/AccountBannedPage.jsx'; 
import AdminUsersPage from './pages/AdminUsersPage.jsx';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchUser = async () => {

      try {
        const res = await fetch('http://localhost:8083/users/id', {
          credentials: 'include',
        });
        if (res.ok) {
          const userData = await res.json();
          console.log(userData)
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
  if (loading) {
    return <div className="text-center text-white pt-16">Loading...</div>;
  }

  if (user && user.isBanned) {
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="pl-64">
          <AccountBannedPage />
        </div>
      </div>
    );
  }
  
  console.log("user:", user);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="pl-64">
        <Routes>
          <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <SignupPage setUser={setUser} /> : <Navigate to="/home" />} />
          <Route path="/post" element={user ? <CreatePostPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/admin/users" element={user && user.isAdmin ? (<AdminUsersPage currentUser={user} />) : (<Navigate to="/home" />)}/>
        </Routes>
      </div>
    </div>
  );
}
export default App;
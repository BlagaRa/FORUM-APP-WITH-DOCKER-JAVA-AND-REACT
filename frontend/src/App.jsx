import LoginPage from './Pages/LoginPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Navbar from './components/Navbar.jsx';
import { useEffect, useState } from 'react';
import ProfilePage from './pages/ProfilePage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8083/users/id', {
          credentials: 'include',
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch {
        console.error('User not logged in or token invalid');
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!user ? <SignupPage setUser={setUser} /> : <Navigate to="/home" />} />
        {/* Only this route for create post: */}
        <Route path="/post" element={user ? <CreatePostPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;
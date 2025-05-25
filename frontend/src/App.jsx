// App.jsx
import LoginPage from './pages/LoginPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Navbar from './components/Navbar.jsx';
import { useEffect, useState } from 'react';
import ProfilePage from './pages/ProfilePage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import AccountBannedPage from './components/AccountBannedPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import TagsPage from './components/TagsPage.jsx';
import MembersPage from './pages/MembersPage.jsx';
import SearchPage from './pages/SearchPage.jsx';

function App() {
  const [user, setUser] = useState(null); // Starea pentru utilizatorul curent autentificat
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8083/users/id', {
          credentials: 'include', // Asigură-te că trimiți cookie-urile pentru autentificare
        });

        if (res.ok) {
          const userData = await res.json();
          console.log("Logged in user data:", userData);
          setUser(userData); // Setează utilizatorul dacă autentificat
        } else {
           console.log("User not logged in (status: " + res.status + ").");
           setUser(null); // Setează user la null dacă nu e autentificat (ex: 401)
        }
      } catch (err) {
         console.error("Error fetching logged in user:", err);
         setUser(null); // Setează user la null în caz de eroare de rețea etc.
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Afișează loading până se verifică autentificarea
  if (loading) {
    return <div className="text-center text-white pt-16">Loading application...</div>;
  }

  // Dacă utilizatorul este bannat, afișează pagina corespunzătoare
  if (user && user.isBanned) {
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="pl-64"> {/* Ajustează padding-ul dacă navbar-ul tău are altă lățime */}
          <AccountBannedPage />
        </div>
      </div>
    );
  }

  console.log("Current user state in App:", user);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="pl-64">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <SignupPage setUser={setUser} /> : <Navigate to="/home" />} />

          <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/post" element={user ? <CreatePostPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId?" element={user ? <ProfilePage currentUser={user} /> : <Navigate to="/login" />} />
          <Route path="/tags" element={user ? <TagsPage /> : <Navigate to="/login" />} />
          <Route path="/members" element={user ? <MembersPage /> : <Navigate to="/login" />} />
        
          <Route
            path="/admin/users"
            element={user ? (<AdminUsersPage currentUser={user} />) : (<Navigate to="/home" />)}
          />
        <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/home" />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
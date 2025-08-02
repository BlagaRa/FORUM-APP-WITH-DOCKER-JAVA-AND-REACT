// components/UserCard.jsx
import { Link } from 'react-router-dom'; // Importă componenta Link

// Componentă simplă pentru afișarea unui utilizator într-o listă
const UserCard = ({ user }) => {
  // Verifică dacă obiectul user există și are proprietatea 'id'
  if (!user || !user.id) {
    console.error("UserCard received invalid user data:", user);
    return null; // Nu rendera nimic dacă datele sunt invalide
  }

  return (
    <Link to={`/profile/${user.id}`} className="block"> {/* 'block' pentru a face întregul div clicabil */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow border border-gray-700 flex items-center space-x-4 transition-transform duration-200 hover:scale-[1.01]">
            {/* Avatarul utilizatorului */}
            <img
                src={user.picture || '/default-avatar.png'}
                alt={`${user.name || 'Unknown User'}'s avatar`}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
            {/* Informații utilizator */}
            <div>
                <div className="font-bold text-green-400 text-lg">{user.name || 'Unknown User'}</div>
                <div className="text-gray-400 text-sm">{user.email || 'No Email Provided'}</div>
                 {/* Poți adăuga și alte detalii aici */}
            </div>
            {/* Am eliminat link-ul separat "View Profile" deoarece întregul card este link */}
        </div>
    </Link>
  );
};

export default UserCard;

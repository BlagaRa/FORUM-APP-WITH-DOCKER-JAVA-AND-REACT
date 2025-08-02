// pages/MembersPage.jsx
import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard'; // Importă componenta UserCard

const MembersPage = () => {
  // State pentru a stoca TOȚI utilizatorii încărcați de la API
  const [allUsers, setAllUsers] = useState([]);
  // State pentru a stoca utilizatorii după aplicarea filtrului (aceștia vor fi afișați)
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State pentru starea de încărcare
  const [loading, setLoading] = useState(true);
  // State pentru eventuale erori
  const [error, setError] = useState(null);
  // State pentru textul introdus în input-ul de filtrare
  const [filterText, setFilterText] = useState('');

  // Efect care se rulează o singură dată la montarea componentei pentru a prelua toți utilizatorii
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Setează starea de încărcare la true
      setError(null);   // Curăță erorile anterioare
      try {
        // Presupunem că ai un endpoint la http://localhost:8083/users care returnează lista tuturor utilizatorilor
        const res = await fetch('http://localhost:8083/users', {
           credentials: 'include', // Include cookie-urile dacă endpoint-ul necesită autentificare
        });

        if (!res.ok) {
           // Dacă răspunsul nu este OK (e.g., 404, 500)
           const errorText = await res.text(); // Încearcă să citești mesajul de eroare din body
           throw new Error(errorText || `Failed to fetch users with status: ${res.status}`);
        }

        const data = await res.json(); // Parsează răspunsul JSON
        console.log("Fetched all users:", data); // Debug log

        // Verifică dacă datele primite sunt un array
        if (Array.isArray(data)) {
             setAllUsers(data); // Stochează lista completă de utilizatori
             // filteredUsers va fi actualizat de următorul efect
        } else {
             console.error("API did not return an array of users:", data);
             throw new Error("Invalid data format received from server.");
        }


      } catch (err) {
         console.error("Error fetching users:", err); // Loghează eroarea completă
         setError(err.message || 'Failed to load members. Please try again.'); // Setează mesajul de eroare
         setAllUsers([]); // Asigură-te că lista este goală în caz de eroare
      } finally {
         setLoading(false); // Setează starea de încărcare la false la finalizarea operației
      }
    };

    fetchUsers(); // Apelează funcția de fetch
  }, []); // Array de dependențe gol: efectul se rulează doar la prima renderizare

  // Efect care se rulează ori de câte ori lista completă (allUsers) sau textul de filtrare (filterText) se schimbă
  useEffect(() => {
     // Aplică logica de filtrare
     const lowercasedFilterText = filterText.toLowerCase();
     const filtered = allUsers.filter(user =>
        // Verifică dacă user.name există și include textul de filtrare (case-insensitive)
        // Adaugă verificarea `user.name` pentru a preveni erori dacă un utilizator nu are nume
        user.name && user.name.toLowerCase().includes(lowercasedFilterText)
        // Poți adăuga și filtrare după email, de exemplu:
        // (user.name && user.name.toLowerCase().includes(lowercasedFilterText)) || (user.email && user.email.toLowerCase().includes(lowercasedFilterText))
     );
     setFilteredUsers(filtered); // Actualizează lista filtrată
  }, [allUsers, filterText]); // Dependențele efectului: allUsers și filterText

  // Handler pentru schimbările în input-ul de filtrare
  const handleFilterChange = (e) => {
     setFilterText(e.target.value); // Actualizează starea filterText
  };

  // --- Logică de renderizare ---

  // Afișează mesaj de încărcare dacă loading este true
  if (loading) {
    return <div className="text-center text-gray-300 py-8">Loading members...</div>;
  }

  // Afișează mesaj de eroare dacă error este setat
  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  // Dacă nu sunt utilizatori deloc (și nu suntem în loading sau eroare)
  if (allUsers.length === 0 && !loading && !error) {
     return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Members</h1>
                {/* Afișează input-ul chiar dacă lista e goală, poate utilizatorul caută ceva */}
                 <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    value={filterText}
                    onChange={handleFilterChange}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
               <div className="text-center text-gray-400">No members found. The list is empty.</div>
            </div>
        </div>
     );
  }


  // Altfel, afișează input-ul de filtrare și lista de utilizatori filtrați
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-xl mx-auto"> {/* Container centrat cu lățime maximă */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Members</h1>

        {/* Input-ul de filtrare */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter members by name..." // Placeholder sugestiv
            value={filterText} // Valoarea input-ului controlată de state
            onChange={handleFilterChange} // Apelează handler-ul la schimbare
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Lista de utilizatori filtrați */}
        {/* Afișează un mesaj dacă filtrarea nu a returnat niciun rezultat */}
        {filteredUsers.length === 0 && allUsers.length > 0 && filterText !== '' && (
             <div className="text-center text-gray-400">No members found matching your filter {filterText}.</div>
        )}

        {/* Mapează lista de utilizatori filtrați la componente UserCard */}
        {filteredUsers.length > 0 && (
           <div className="space-y-4"> {/* Spațiu între carduri */}
             {filteredUsers.map(user => (
                // Renderează UserCard pentru fiecare utilizator
                // Folosește user.id ca și key (presupunând că ID-ul este unic)
                <UserCard key={user.id} user={user} />
             ))}
           </div>
        )}

      </div>
    </div>
  );
};

export default MembersPage;
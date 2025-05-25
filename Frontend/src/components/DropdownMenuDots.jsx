// components/DropdownMenuDots.jsx
import { useRef, useState, useEffect } from "react";

const DropdownMenuDots = ({
  onDelete,
  onDetails,
  onHideLikes,
  onEdit,
  hideLikes, // Proprie pentru a ști textul butonului Hide/Show Likes
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Efect pentru a închide dropdown-ul când se dă click în afara lui
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Verifică dacă click-ul NU este în interiorul elementului referențiat de ref
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    // Adaugă event listener doar dacă dropdown-ul este deschis
    if (open) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    // Cleanup: elimină event listener-ul la demontare sau când `open` devine false
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]); // Rulează efectul doar când starea 'open' se schimbă

  return (
    // Folosim ref aici pentru a detecta click-urile din afara dropdown-ului
    <div className="relative" ref={ref}>
      {/* Butonul cu cele 3 puncte SVG */}
      <button
        aria-label="Actions"
        className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200" // Adăugat tranziție
        onClick={(e) => {
          // Oprește propagarea evenimentului pentru a evita închiderea imediată dacă Post-ul are un handler de click propriu
          e.stopPropagation();
          setOpen((v) => !v); // Toggle starea open
        }}
      >
        {/* Iconița cu 3 puncte - SVG simplu */}
        <svg width={20} height={20} fill="white">
          <circle cx={4} cy={10} r={2} />
          <circle cx={10} cy={10} r={2} />
          <circle cx={16} cy={10} r={2} />
        </svg>
      </button>

      {/* Dropdown-ul, afișat condițional */}
      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 bg-gray-900 border border-gray-700 rounded shadow-lg py-1">
          {/* Buton "Details about post" */}
          <button
            className="w-full text-left block px-4 py-2 hover:bg-gray-800 text-sm text-white transition-colors duration-200"
            onClick={() => {
              setOpen(false); // Închide dropdown-ul la click
              onDetails && onDetails(); // Execută funcția onDetails dacă există
            }}
          >
            Details about post
          </button>

          {/* Buton "Hide/Show likes" */}
          <button
            className="w-full text-left block px-4 py-2 hover:bg-gray-800 text-sm text-white transition-colors duration-200"
            onClick={() => {
              setOpen(false); // Închide dropdown-ul
              onHideLikes && onHideLikes(); // Execută funcția onHideLikes
            }}
          >
            {/* Textul butonului depinde de prop-ul hideLikes */}
            {hideLikes ? "Show likes" : "Hide likes"}
          </button>

          {/* Buton "Edit" */}
          <button
            className="w-full text-left block px-4 py-2 hover:bg-gray-800 text-sm text-white transition-colors duration-200"
            onClick={() => {
              setOpen(false); // Închide dropdown-ul
              onEdit && onEdit(); // Execută funcția onEdit
            }}
          >
            Edit
          </button>

          {/* Buton "Delete post" */}
          {/* Acesta va fi vizibil doar dacă Post-ul i-a pasat funcția onDelete */}
          {onDelete && (
              <button
                className="w-full text-left block px-4 py-2 hover:bg-red-700 text-sm text-red-300 transition-colors duration-200"
                onClick={() => {
                  setOpen(false); // Închide dropdown-ul
                  onDelete(); // Execută funcția onDelete (nu mai verificăm if onDelete exists aici, e verificat sus)
                }}
              >
                Delete post
              </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenuDots;
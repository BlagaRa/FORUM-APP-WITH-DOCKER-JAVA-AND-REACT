import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [text, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null); // Starea pentru utilizator
  const navigate = useNavigate();

  // Verifică utilizatorul curent
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8083/users/id', {
          credentials: 'include',
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setError('You must be logged in to create a post.');
          navigate('/login');
        }
      } catch {
        setError('Could not verify user. Please log in again.');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated. Please log in.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      let res;
      if (photo) {
        const postPayload = {
          title,
          text,
          picture: null,
          authorId: user.id, 
        };
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('data', new Blob([JSON.stringify(postPayload)], { type: 'application/json' }));
        console.log('Payload with photo:', postPayload);
        res = await fetch('http://localhost:8082/posts/ph', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
      } else {
        const postPayload = {
          title,
          text,
          authorId: user.id, // Adaugă authorId în payload
        };
        console.log('Payload without photo:', postPayload);
        res = await fetch('http://localhost:8082/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(postPayload),
        });
      }

      if (res.ok) {
        navigate('/home');
      } else {
        const msg = await res.text();
        setError(msg || 'Could not create post.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Create a New Post</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <label className="block mb-2 text-gray-300">Title</label>
        <input
          type="text"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 text-gray-300">Content</label>
        <textarea
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={text}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
        />

        <label className="block mb-2 text-gray-300">Image (optional)</label>
        <input
          type="file"
          className="block mb-4 text-gray-200"
          accept="image/*"
          onChange={handlePhotoChange}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold transition"
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
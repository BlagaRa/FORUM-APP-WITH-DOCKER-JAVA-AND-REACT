import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [text, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let res;
      if (photo) {
        // Make the Post shape. Add all required/default values.
        const postPayload = {
          title,
          text,
          picture: null, // backend will set this once uploaded
          // add other defaults the backend expects for Post (authorId, tags, etc) if needed
        };
        const formData = new FormData();
        formData.append('photo', photo);
        var n=JSON.stringify(postPayload);
        formData.append('data',new Blob([JSON.stringify(postPayload)], { type: 'application/json' })); // MUST be type application/json!
        console.log(n);
        res = await fetch('http://localhost:8082/posts/ph', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
      } else {
        // No photo
        const postPayload = {
          title,
          text,
          // add all required fields!
        };
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
    } catch  {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 text-gray-300">Content</label>
        <textarea
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={text}
          onChange={e => setContent(e.target.value)}
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
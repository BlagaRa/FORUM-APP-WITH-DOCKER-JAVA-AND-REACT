import { useEffect, useState } from 'react';
import Post from '../components/Post';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:8082/posts/filtered', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-16 px-4 sm:px-0">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">🖼️ Explore Posts</h1>

        {loading ? (
          <div className="text-gray-400 text-center">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-500 text-center italic border border-gray-700 rounded-lg py-8 bg-gray-800">
            No posts available
          </div>
        ) : (
          posts.map((p) => <Post key={p.post.id} post={p.post} />)
        )}
      </div>
    </div>
  );
};

export default HomePage;
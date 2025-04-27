const Post = ({ post }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg border border-gray-700">
    <div className="flex items-center mb-3">
      <img src={post.author.picture || '/default-avatar.png'} alt="author" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <div className="font-bold text-green-400">{post.author.name}</div>
        <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
      </div>
    </div>
    <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
    {post.imageUrl && (
      <img src={post.imageUrl} alt="Post" className="w-full h-60 object-cover rounded-lg mb-3" />
    )}
    <p className="text-gray-300 mb-4">{post.content}</p>
    <div className="flex items-center space-x-6 text-gray-400 text-sm">
      <div>👍 {post.likes} Likes</div>
      <div>💬 {post.comments.length} Comments</div>
    </div>
  </div>
);

export default Post;
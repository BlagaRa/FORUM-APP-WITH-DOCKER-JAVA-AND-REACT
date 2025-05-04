
const PostLoadingSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-md border border-gray-700 animate-pulse">
      {/* User Info Skeleton */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
        <div className="h-4 bg-gray-700 rounded w-32"></div>
      </div>

      {/* Post Image Skeleton */}
      <div className="w-full h-64 bg-gray-700 rounded-lg mb-4"></div>

      {/* Text Skeleton */}
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-2/4 mb-4"></div>

      {/* Likes Bar Skeleton */}
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>

      {/* Comments Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default PostLoadingSkeleton;

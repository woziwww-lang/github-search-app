export const SkeletonCard = () => {
  return (
    <div className="border border-gray-800 rounded-xl p-5 bg-gray-800/30 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-700/50" />
        <div className="flex-1">
          <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-700/50 rounded w-1/4" />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700/50 rounded w-full" />
        <div className="h-4 bg-gray-700/50 rounded w-5/6" />
        <div className="h-4 bg-gray-700/50 rounded w-4/6" />
      </div>

      <div className="flex gap-4 py-4 border-t border-b border-gray-700/50">
        <div className="h-4 bg-gray-700/50 rounded w-16" />
        <div className="h-4 bg-gray-700/50 rounded w-16" />
        <div className="h-4 bg-gray-700/50 rounded w-20" />
      </div>

      <div className="mt-3">
        <div className="h-3 bg-gray-700/50 rounded w-32" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

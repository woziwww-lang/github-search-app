export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-gray-400">Searching repositories...</p>
    </div>
  );
};

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const SearchBar = ({ onSearch, loading = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories... (e.g., react, typescript)"
          className="flex-1 px-5 py-3 text-base rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500
                     focus:outline-none focus:border-primary transition-colors duration-200"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark
                     rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  history?: string[];
  onRemoveHistory?: (query: string) => void;
  onClearHistory?: () => void;
}

export const SearchBar = ({
  onSearch,
  loading = false,
  history = [],
  onRemoveHistory,
  onClearHistory
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    onSearch(historyQuery);
    setShowHistory(false);
  };

  const handleRemoveHistory = (e: React.MouseEvent, historyQuery: string) => {
    e.stopPropagation();
    onRemoveHistory?.(historyQuery);
  };

  const filteredHistory = history.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              placeholder="Search repositories... (e.g., react, typescript)"
              className="w-full px-5 py-3 text-base rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500
                         focus:outline-none focus:border-primary transition-colors duration-200"
              disabled={loading}
            />

            {showHistory && filteredHistory.length > 0 && (
              <div
                ref={historyRef}
                className="absolute top-full left-0 right-0 mt-2 py-2 rounded-lg border border-gray-700 bg-gray-800 shadow-xl z-10 max-h-64 overflow-y-auto"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                  <span className="text-xs font-medium text-gray-400">Recent Searches</span>
                  {onClearHistory && (
                    <button
                      type="button"
                      onClick={onClearHistory}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {filteredHistory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-700/50 cursor-pointer transition-colors group"
                  >
                    <span className="text-sm text-gray-300 group-hover:text-white">{item}</span>
                    {onRemoveHistory && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveHistory(e, item)}
                        className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
    </div>
  );
};

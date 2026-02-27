import { useState } from 'react';
import type { SearchFilters, SortOption } from '../../../types/github';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  disabled?: boolean;
}

const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
];

export const SearchFiltersComponent = ({
  onFiltersChange,
  onSortChange,
  currentSort,
  disabled = false
}: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState('');
  const [minStars, setMinStars] = useState('');
  const [dateFrom, setDateFrom] = useState('');

  const handleApplyFilters = () => {
    const filters: SearchFilters = {};

    if (language) {
      filters.language = language;
    }
    if (minStars && !isNaN(Number(minStars))) {
      filters.minStars = Number(minStars);
    }
    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }

    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setLanguage('');
    setMinStars('');
    setDateFrom('');
    onFiltersChange({});
  };

  const hasActiveFilters = language || minStars || dateFrom;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                     bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isExpanded ? '▼' : '▶'}</span>
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-white">
              Active
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Sort by:</label>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            disabled={disabled}
            className="px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white
                       focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          >
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white
                         focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">All Languages</option>
              {POPULAR_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Stars
            </label>
            <input
              type="number"
              value={minStars}
              onChange={(e) => setMinStars(e.target.value)}
              placeholder="e.g., 100"
              min="0"
              disabled={disabled}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white
                         placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Created After
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-white
                         focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleApplyFilters}
              disabled={disabled}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all
                         bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              disabled={disabled || !hasActiveFilters}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all
                         bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

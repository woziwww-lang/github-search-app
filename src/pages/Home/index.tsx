import { useState } from 'react';
import { useGitHubSearch } from '../../hooks/useGitHubSearch';
import { useFavorites } from '../../hooks/useFavorites';
import { useTrending } from '../../hooks/useTrending';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useTheme } from '../../hooks/useTheme';
import { SearchBar } from '../../components/features/SearchBar';
import { SearchFiltersComponent } from '../../components/features/SearchFilters';
import { RepoCard } from '../../components/features/RepoCard';
import { Pagination } from '../../components/features/Pagination';
import { Loading } from '../../components/common/Loading';
import { calculateTotalPages, formatNumber } from '../../utils/format';
import type { SortOption, SearchFilters } from '../../types/github';

const ITEMS_PER_PAGE = 10;

type ViewMode = 'search' | 'trending' | 'favorites';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('trending');
  const [sortOption, setSortOption] = useState<SortOption>('stars');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { repos: searchRepos, totalCount, loading: searchLoading, error: searchError, hasSearched, search } = useGitHubSearch();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { repos: trendingRepos, loading: trendingLoading, error: trendingError } = useTrending();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { theme, toggleTheme } = useTheme();

  const totalPages = calculateTotalPages(totalCount, ITEMS_PER_PAGE);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setViewMode('search');
    addToHistory(query);
    search(query, 1, ITEMS_PER_PAGE, sortOption, searchFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    search(searchQuery, page, ITEMS_PER_PAGE, sortOption, searchFilters);
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
    if (searchQuery && viewMode === 'search') {
      setCurrentPage(1);
      search(searchQuery, 1, ITEMS_PER_PAGE, sortOption, filters);
    }
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    if (searchQuery && viewMode === 'search') {
      setCurrentPage(1);
      search(searchQuery, 1, ITEMS_PER_PAGE, sort, searchFilters);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  const displayRepos = viewMode === 'search' ? searchRepos : viewMode === 'favorites' ? favorites : trendingRepos;
  const isLoading = viewMode === 'search' ? searchLoading : viewMode === 'trending' ? trendingLoading : false;
  const error = viewMode === 'search' ? searchError : viewMode === 'trending' ? trendingError : null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              GitHub Repository Search
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="text-gray-400 text-lg">
            Search millions of repositories on GitHub
          </p>
        </header>

        <SearchBar
          onSearch={handleSearch}
          loading={searchLoading}
          history={history}
          onRemoveHistory={removeFromHistory}
          onClearHistory={clearHistory}
        />

        {viewMode === 'search' && (
          <SearchFiltersComponent
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            currentSort={sortOption}
            disabled={searchLoading}
          />
        )}

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleViewModeChange('trending')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'trending'
                ? 'bg-primary text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            🔥 Trending
          </button>
          {hasSearched && (
            <button
              onClick={() => handleViewModeChange('search')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'search'
                  ? 'bg-primary text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              🔍 Search Results
            </button>
          )}
          <button
            onClick={() => handleViewModeChange('favorites')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'favorites'
                ? 'bg-primary text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            ⭐ Favorites ({favorites.length})
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && <Loading />}

        {!isLoading && displayRepos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {viewMode === 'search' && hasSearched && (
              <p className="text-lg">No repositories found for "{searchQuery}"</p>
            )}
            {viewMode === 'favorites' && (
              <div>
                <p className="text-lg mb-2">No favorites yet</p>
                <p className="text-sm">Click the star icon on any repository to add it to your favorites</p>
              </div>
            )}
            {viewMode === 'trending' && !error && (
              <p className="text-lg">No trending repositories available</p>
            )}
          </div>
        )}

        {!isLoading && displayRepos.length > 0 && (
          <>
            {viewMode === 'search' && (
              <div className="text-center mb-6 text-gray-400 text-sm">
                Found {formatNumber(totalCount)} repositories (showing page {currentPage} of {totalPages})
              </div>
            )}
            {viewMode === 'trending' && (
              <div className="text-center mb-6 text-gray-400 text-sm">
                🔥 Showing trending repositories from the past month
              </div>
            )}
            {viewMode === 'favorites' && (
              <div className="text-center mb-6 text-gray-400 text-sm">
                ⭐ Your saved favorite repositories ({favorites.length})
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {displayRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isFavorite={isFavorite(repo.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {viewMode === 'search' && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useGitHubSearch } from '../../hooks/useGitHubSearch';
import { useFavorites } from '../../hooks/useFavorites';
import { useTrending } from '../../hooks/useTrending';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useTheme } from '../../hooks/useTheme';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { SearchBar } from '../../components/features/SearchBar';
import { SearchFiltersComponent } from '../../components/features/SearchFilters';
import { RepoCard } from '../../components/features/RepoCard';
import { Pagination } from '../../components/features/Pagination';
import { SkeletonGrid } from '../../components/common/SkeletonCard';
import { BackToTop } from '../../components/common/BackToTop';
import { LoadingBar } from '../../components/common/LoadingBar';
import { EmptyState } from '../../components/common/EmptyState';
import { PullToRefresh } from '../../components/common/PullToRefresh';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { ExportMenu } from '../../components/features/ExportMenu';
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

  // Pull to refresh
  const handleRefresh = async () => {
    if (viewMode === 'trending') {
      window.location.reload();
    } else if (viewMode === 'search' && searchQuery) {
      await search(searchQuery, currentPage, ITEMS_PER_PAGE, sortOption, searchFilters);
    }
  };

  const { isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: true,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearchFocus: () => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      input?.focus();
    },
    onQuickSearch: () => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      input?.focus();
    },
    onEscape: () => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      input?.blur();
    },
  });

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
    <>
      <LoadingBar isLoading={isLoading} />
      <PullToRefresh isPulling={isPulling} isRefreshing={isRefreshing} pullDistance={pullDistance} />
      <BackToTop />

      {/* Floating theme toggle button - top right */}
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="min-h-screen py-4 md:py-8 px-3 md:px-4 pb-32 md:pb-8">
        <div className="max-w-6xl mx-auto pb-24 md:pb-0">
          <header className="text-center mb-8 md:mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-3">
              GitHub Repository Search
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Search millions of repositories on GitHub
            </p>
            <div className="mt-3 text-xs md:text-sm text-gray-500">
              <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">/</kbd> to focus search
              {' · '}
              <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-700">Ctrl+K</kbd> for quick search
            </div>
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

        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-6 md:mb-8 animate-slide-in-up">
          <button
            onClick={() => handleViewModeChange('trending')}
            className={`px-4 md:px-6 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
              viewMode === 'trending'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            🔥 Trending
          </button>
          {hasSearched && (
            <button
              onClick={() => handleViewModeChange('search')}
              className={`px-4 md:px-6 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                viewMode === 'search'
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              🔍 Search Results
            </button>
          )}
          <button
            onClick={() => handleViewModeChange('favorites')}
            className={`px-4 md:px-6 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
              viewMode === 'favorites'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            ⭐ Favorites ({favorites.length})
          </button>

          {/* Export menu - only show in favorites view */}
          {viewMode === 'favorites' && (
            <ExportMenu repos={favorites} disabled={isLoading} />
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <strong className="block mb-1">Error</strong>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && <SkeletonGrid count={ITEMS_PER_PAGE} />}

        {!isLoading && displayRepos.length === 0 && (
          <>
            {viewMode === 'search' && hasSearched && (
              <EmptyState
                icon="🔍"
                title="No repositories found"
                description={`No results found for "${searchQuery}". Try adjusting your search terms or filters.`}
                action={{
                  label: 'Clear Filters',
                  onClick: () => setSearchFilters({}),
                }}
              />
            )}
            {viewMode === 'favorites' && (
              <EmptyState
                icon="⭐"
                title="No favorites yet"
                description="Start adding repositories to your favorites by clicking the star icon on any repository card."
                action={{
                  label: 'Browse Trending',
                  onClick: () => handleViewModeChange('trending'),
                }}
              />
            )}
            {viewMode === 'trending' && !error && (
              <EmptyState
                icon="🔥"
                title="No trending repositories"
                description="No trending repositories available at the moment. Please try again later."
              />
            )}
          </>
        )}

        {!isLoading && displayRepos.length > 0 && (
          <>
            {viewMode === 'search' && (
              <div className="text-center mb-4 md:mb-6 text-gray-400 text-xs md:text-sm animate-fade-in">
                Found {formatNumber(totalCount)} repositories (showing page {currentPage} of {totalPages})
              </div>
            )}
            {viewMode === 'trending' && (
              <div className="text-center mb-4 md:mb-6 text-gray-400 text-xs md:text-sm animate-fade-in">
                🔥 Showing trending repositories from the past month
              </div>
            )}
            {viewMode === 'favorites' && (
              <div className="text-center mb-4 md:mb-6 animate-fade-in">
                <div className="text-gray-400 text-xs md:text-sm mb-2">
                  ⭐ Your saved favorite repositories ({favorites.length})
                </div>
                <div className="text-xs text-gray-500">
                  Click the Export button above to download or copy your favorites
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8">
              {displayRepos.map((repo) => (
                <div key={repo.id} className="stagger-item">
                  <RepoCard
                    repo={repo}
                    isFavorite={isFavorite(repo.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
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
    </>
  );
};

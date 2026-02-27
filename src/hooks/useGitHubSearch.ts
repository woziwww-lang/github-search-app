import { useState, useCallback } from 'react';
import { searchRepositories, GitHubAPIError } from '../api/github';
import type { GitHubRepo, SortOption, SearchFilters } from '../types/github';

interface UseGitHubSearchResult {
  repos: GitHubRepo[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: (query: string, page: number, perPage: number, sort?: SortOption, filters?: SearchFilters) => Promise<void>;
  reset: () => void;
}

export const useGitHubSearch = (): UseGitHubSearchResult => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (query: string, page: number, perPage: number, sort?: SortOption, filters?: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchRepositories({ query, page, perPage, sort, filters });
      setRepos(data.items);
      setTotalCount(data.total_count);
      setHasSearched(true);
    } catch (err) {
      if (err instanceof GitHubAPIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRepos([]);
    setTotalCount(0);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    repos,
    totalCount,
    loading,
    error,
    hasSearched,
    search,
    reset,
  };
};

import { useState, useEffect } from 'react';
import { getTrendingRepositories } from '../api/github';
import type { GitHubRepo } from '../types/github';

export const useTrending = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrendingRepositories();
        setRepos(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trending repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return { repos, loading, error };
};

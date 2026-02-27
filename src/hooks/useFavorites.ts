import { useState, useEffect, useCallback } from 'react';
import type { GitHubRepo } from '../types/github';

const FAVORITES_KEY = 'github-search-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<GitHubRepo[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((repo: GitHubRepo) => {
    setFavorites((prev) => {
      // Check if already favorited
      if (prev.some((fav) => fav.id === repo.id)) {
        return prev;
      }
      return [...prev, repo];
    });
  }, []);

  const removeFavorite = useCallback((repoId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== repoId));
  }, []);

  const toggleFavorite = useCallback((repo: GitHubRepo) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === repo.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== repo.id);
      }
      return [...prev, repo];
    });
  }, []);

  const isFavorite = useCallback(
    (repoId: number) => {
      return favorites.some((fav) => fav.id === repoId);
    },
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};

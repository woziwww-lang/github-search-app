import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from './useFavorites';
import type { GitHubRepo } from '../types/github';

const mockRepo: GitHubRepo = {
  id: 1,
  name: 'test-repo',
  full_name: 'user/test-repo',
  owner: {
    login: 'user',
    avatar_url: 'https://example.com/avatar.jpg',
    html_url: 'https://github.com/user',
  },
  html_url: 'https://github.com/user/test-repo',
  description: 'Test repository',
  stargazers_count: 100,
  watchers_count: 50,
  forks_count: 25,
  language: 'TypeScript',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockRepo2: GitHubRepo = {
  ...mockRepo,
  id: 2,
  name: 'test-repo-2',
  full_name: 'user/test-repo-2',
};

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('should load favorites from localStorage', () => {
    localStorage.setItem('github-search-favorites', JSON.stringify([mockRepo]));
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([mockRepo]);
  });

  it('should add a favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockRepo);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockRepo);
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockRepo);
      result.current.addFavorite(mockRepo);
    });

    expect(result.current.favorites).toHaveLength(1);
  });

  it('should remove a favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockRepo);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.removeFavorite(mockRepo.id);
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('should toggle favorite on/off', () => {
    const { result } = renderHook(() => useFavorites());

    // Toggle on
    act(() => {
      result.current.toggleFavorite(mockRepo);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(mockRepo.id)).toBe(true);

    // Toggle off
    act(() => {
      result.current.toggleFavorite(mockRepo);
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(mockRepo.id)).toBe(false);
  });

  it('should check if repo is favorite', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite(mockRepo.id)).toBe(false);

    act(() => {
      result.current.addFavorite(mockRepo);
    });

    expect(result.current.isFavorite(mockRepo.id)).toBe(true);
  });

  it('should handle multiple favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockRepo);
      result.current.addFavorite(mockRepo2);
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite(mockRepo.id)).toBe(true);
    expect(result.current.isFavorite(mockRepo2.id)).toBe(true);
  });

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockRepo);
    });

    const stored = localStorage.getItem('github-search-favorites');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual([mockRepo]);
  });
});

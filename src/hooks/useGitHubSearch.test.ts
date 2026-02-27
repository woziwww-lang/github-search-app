import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGitHubSearch } from './useGitHubSearch';
import * as githubApi from '../api/github';

vi.mock('../api/github');

describe('useGitHubSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGitHubSearch());

    expect(result.current.repos).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });

  it('should search repositories successfully', async () => {
    const mockData = {
      total_count: 100,
      incomplete_results: false,
      items: [
        {
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
        },
      ],
    };

    vi.mocked(githubApi.searchRepositories).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGitHubSearch());

    await act(async () => {
      await result.current.search('react', 1, 10);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repos).toEqual(mockData.items);
    expect(result.current.totalCount).toBe(100);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should set loading state during search', async () => {
    vi.mocked(githubApi.searchRepositories).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useGitHubSearch());

    act(() => {
      result.current.search('react', 1, 10);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should handle errors', async () => {
    vi.mocked(githubApi.searchRepositories).mockRejectedValue(new Error('Generic error'));

    const { result } = renderHook(() => useGitHubSearch());

    await act(async () => {
      await result.current.search('react', 1, 10);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('An unexpected error occurred');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useGitHubSearch());

    // Manually set some state
    act(() => {
      result.current.search('react', 1, 10);
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.repos).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });
});

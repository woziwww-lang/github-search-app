import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchRepositories, getTrendingRepositories, GitHubAPIError } from './github';

describe('GitHub API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchRepositories', () => {
    it('should fetch repositories successfully', async () => {
      const mockResponse = {
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

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchRepositories({
        query: 'react',
        page: 1,
        perPage: 10,
      });

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw error for empty query', async () => {
      await expect(
        searchRepositories({ query: '', page: 1, perPage: 10 })
      ).rejects.toThrow(GitHubAPIError);

      await expect(
        searchRepositories({ query: '   ', page: 1, perPage: 10 })
      ).rejects.toThrow('Search query cannot be empty');
    });

    it('should handle HTTP errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        searchRepositories({ query: 'test', page: 1, perPage: 10 })
      ).rejects.toThrow(GitHubAPIError);
    });

    it('should handle network errors', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        searchRepositories({ query: 'test', page: 1, perPage: 10 })
      ).rejects.toThrow(GitHubAPIError);
    });

    it('should build correct URL with parameters', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ total_count: 0, incomplete_results: false, items: [] }),
      });

      await searchRepositories({ query: 'react hooks', page: 2, perPage: 20 });

      const fetchCall = (globalThis.fetch as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
      expect(fetchCall).toContain('q=react+hooks');
      expect(fetchCall).toContain('page=2');
      expect(fetchCall).toContain('per_page=20');
      expect(fetchCall).toContain('sort=stars');
      expect(fetchCall).toContain('order=desc');
    });
  });

  describe('getTrendingRepositories', () => {
    it('should fetch trending repositories successfully', async () => {
      const mockResponse = {
        total_count: 10,
        incomplete_results: false,
        items: [
          {
            id: 2,
            name: 'trending-repo',
            full_name: 'user/trending-repo',
            owner: {
              login: 'user',
              avatar_url: 'https://example.com/avatar.jpg',
              html_url: 'https://github.com/user',
            },
            html_url: 'https://github.com/user/trending-repo',
            description: 'Trending repository',
            stargazers_count: 5000,
            watchers_count: 2000,
            forks_count: 500,
            language: 'JavaScript',
            updated_at: '2024-01-15T00:00:00Z',
          },
        ],
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTrendingRepositories();

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should build correct URL for trending repos', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ total_count: 0, incomplete_results: false, items: [] }),
      });

      await getTrendingRepositories();

      const fetchCall = (globalThis.fetch as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
      expect(fetchCall).toContain('created%3A%3E'); // URL encoded 'created:>'
      expect(fetchCall).toContain('stars%3A%3E1000'); // URL encoded 'stars:>1000'
      expect(fetchCall).toContain('sort=stars');
      expect(fetchCall).toContain('order=desc');
      expect(fetchCall).toContain('per_page=10');
    });

    it('should handle HTTP errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getTrendingRepositories()).rejects.toThrow(GitHubAPIError);
    });
  });

  describe('GitHubAPIError', () => {
    it('should create error with message', () => {
      const error = new GitHubAPIError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('GitHubAPIError');
    });

    it('should create error with status and statusText', () => {
      const error = new GitHubAPIError('Test error', 404, 'Not Found');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
    });
  });
});

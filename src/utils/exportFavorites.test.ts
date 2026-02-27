import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToJSON, exportToCSV, copyLinksToClipboard, exportToMarkdown } from './exportFavorites';
import type { GitHubRepo } from '../types/github';

const mockRepos: GitHubRepo[] = [
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
  {
    id: 2,
    name: 'another-repo',
    full_name: 'user/another-repo',
    owner: {
      login: 'user',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/user',
    },
    html_url: 'https://github.com/user/another-repo',
    description: 'Another test repository',
    stargazers_count: 200,
    watchers_count: 100,
    forks_count: 50,
    language: 'JavaScript',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

describe('exportFavorites', () => {
  let mockLink: any;
  let appendChildSpy: any;
  let removeChildSpy: any;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;

  beforeEach(() => {
    mockLink = {
      click: vi.fn(),
      href: '',
      download: '',
      setAttribute: vi.fn(),
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportToJSON', () => {
    it('should create JSON file with correct data', () => {
      exportToJSON(mockRepos);

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should create file with date in filename', () => {
      exportToJSON(mockRepos);

      expect(mockLink.download).toMatch(/^github-favorites-\d{4}-\d{2}-\d{2}\.json$/);
    });

    it('should handle empty repos array', () => {
      exportToJSON([]);

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToCSV', () => {
    it('should create CSV file with correct data', () => {
      exportToCSV(mockRepos);

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should create file with date in filename', () => {
      exportToCSV(mockRepos);

      expect(mockLink.download).toMatch(/^github-favorites-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('should handle repos with null description', () => {
      const reposWithNull = [{ ...mockRepos[0], description: null }];

      expect(() => exportToCSV(reposWithNull)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle repos with null language', () => {
      const reposWithNull = [{ ...mockRepos[0], language: null }];

      expect(() => exportToCSV(reposWithNull)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('exportToMarkdown', () => {
    it('should create Markdown file with correct data', () => {
      exportToMarkdown(mockRepos);

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should create file with date in filename', () => {
      exportToMarkdown(mockRepos);

      expect(mockLink.download).toMatch(/^github-favorites-\d{4}-\d{2}-\d{2}\.md$/);
    });

    it('should handle repos with null description', () => {
      const reposWithNull = [{ ...mockRepos[0], description: null }];

      expect(() => exportToMarkdown(reposWithNull)).not.toThrow();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('copyLinksToClipboard', () => {
    it('should copy links to clipboard successfully', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const result = await copyLinksToClipboard(mockRepos);

      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith(
        'user/test-repo: https://github.com/user/test-repo\n' +
        'user/another-repo: https://github.com/user/another-repo'
      );
    });

    it('should return false on clipboard error', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard error'));

      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const result = await copyLinksToClipboard(mockRepos);

      expect(result).toBe(false);
    });

    it('should handle empty repos array', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const result = await copyLinksToClipboard([]);

      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('');
    });
  });
});

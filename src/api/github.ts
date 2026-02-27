import type { GitHubSearchResponse, SearchParams } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPIError extends Error {
  status?: number;
  statusText?: string;

  constructor(
    message: string,
    status?: number,
    statusText?: string
  ) {
    super(message);
    this.name = 'GitHubAPIError';
    this.status = status;
    this.statusText = statusText;
  }
}

export const searchRepositories = async ({
  query,
  page,
  perPage,
  sort = 'stars',
  filters,
}: SearchParams): Promise<GitHubSearchResponse> => {
  if (!query.trim()) {
    throw new GitHubAPIError('Search query cannot be empty');
  }

  let searchQuery = query;

  // Apply filters to the query
  if (filters) {
    if (filters.language) {
      searchQuery += ` language:${filters.language}`;
    }
    if (filters.minStars !== undefined && filters.minStars > 0) {
      searchQuery += ` stars:>=${filters.minStars}`;
    }
    if (filters.dateFrom) {
      searchQuery += ` created:>=${filters.dateFrom}`;
    }
  }

  const url = new URL(`${GITHUB_API_BASE}/search/repositories`);
  url.searchParams.append('q', searchQuery);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('per_page', perPage.toString());
  url.searchParams.append('sort', sort);
  url.searchParams.append('order', 'desc');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new GitHubAPIError(
        `Failed to fetch repositories: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data: GitHubSearchResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw error;
    }
    throw new GitHubAPIError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
};

export const getTrendingRepositories = async (): Promise<GitHubSearchResponse> => {
  // Get trending repos by searching for recently created repos with high stars
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const dateStr = oneMonthAgo.toISOString().split('T')[0];

  const url = new URL(`${GITHUB_API_BASE}/search/repositories`);
  url.searchParams.append('q', `created:>${dateStr} stars:>1000`);
  url.searchParams.append('sort', 'stars');
  url.searchParams.append('order', 'desc');
  url.searchParams.append('per_page', '10');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new GitHubAPIError(
        `Failed to fetch trending repositories: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data: GitHubSearchResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw error;
    }
    throw new GitHubAPIError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
};

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepoCard } from './index';
import type { GitHubRepo } from '../../../types/github';

const mockRepo: GitHubRepo = {
  id: 1,
  name: 'test-repo',
  full_name: 'user/test-repo',
  owner: {
    login: 'testuser',
    avatar_url: 'https://example.com/avatar.jpg',
    html_url: 'https://github.com/testuser',
  },
  html_url: 'https://github.com/user/test-repo',
  description: 'This is a test repository',
  stargazers_count: 1000,
  watchers_count: 500,
  forks_count: 250,
  language: 'TypeScript',
  updated_at: '2024-01-15T10:30:00Z',
};

describe('RepoCard', () => {
  it('should render repository information', () => {
    render(<RepoCard repo={mockRepo} />);

    expect(screen.getByText('user/test-repo')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test repository')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should display formatted star and fork counts', () => {
    render(<RepoCard repo={mockRepo} />);

    expect(screen.getByText('1,000')).toBeInTheDocument(); // stars
    expect(screen.getByText('250')).toBeInTheDocument(); // forks
  });

  it('should render owner avatar', () => {
    render(<RepoCard repo={mockRepo} />);

    const avatar = screen.getByRole('img', { name: 'testuser' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should show "No description provided" when description is null', () => {
    const repoWithoutDesc = { ...mockRepo, description: null };
    render(<RepoCard repo={repoWithoutDesc} />);

    expect(screen.getByText('No description provided')).toBeInTheDocument();
  });

  it('should not show language when it is null', () => {
    const repoWithoutLang = { ...mockRepo, language: null };
    render(<RepoCard repo={repoWithoutLang} />);

    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  it('should render repository and owner links', () => {
    render(<RepoCard repo={mockRepo} />);

    const repoLink = screen.getByRole('link', { name: 'user/test-repo' });
    const ownerLink = screen.getByRole('link', { name: '@testuser' });

    expect(repoLink).toHaveAttribute('href', 'https://github.com/user/test-repo');
    expect(ownerLink).toHaveAttribute('href', 'https://github.com/testuser');
    expect(repoLink).toHaveAttribute('target', '_blank');
    expect(ownerLink).toHaveAttribute('target', '_blank');
  });

  it('should render favorite button when onToggleFavorite is provided', () => {
    const onToggleFavorite = vi.fn();
    render(<RepoCard repo={mockRepo} onToggleFavorite={onToggleFavorite} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should not render favorite button when onToggleFavorite is not provided', () => {
    render(<RepoCard repo={mockRepo} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onToggleFavorite when favorite button is clicked', async () => {
    const onToggleFavorite = vi.fn();
    const user = userEvent.setup();
    render(<RepoCard repo={mockRepo} onToggleFavorite={onToggleFavorite} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onToggleFavorite).toHaveBeenCalledWith(mockRepo);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('should show filled star when isFavorite is true', () => {
    const onToggleFavorite = vi.fn();
    render(
      <RepoCard repo={mockRepo} isFavorite={true} onToggleFavorite={onToggleFavorite} />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Remove from favorites');
  });

  it('should show outlined star when isFavorite is false', () => {
    const onToggleFavorite = vi.fn();
    render(
      <RepoCard repo={mockRepo} isFavorite={false} onToggleFavorite={onToggleFavorite} />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Add to favorites');
  });
});

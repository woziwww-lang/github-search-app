import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportMenu } from './index';
import type { GitHubRepo } from '../../../types/github';
import * as exportUtils from '../../../utils/exportFavorites';

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
];

describe('ExportMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when repos array is empty', () => {
    const { container } = render(<ExportMenu repos={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render export button when repos exist', () => {
    render(<ExportMenu repos={mockRepos} />);

    const button = screen.getByRole('button', { name: /export/i });
    expect(button).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ExportMenu repos={mockRepos} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should open menu when clicked', () => {
    render(<ExportMenu repos={mockRepos} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText(/export 1 repository/i)).toBeInTheDocument();
  });

  it('should show correct count for multiple repos', () => {
    const multipleRepos = [...mockRepos, { ...mockRepos[0], id: 2 }];
    render(<ExportMenu repos={multipleRepos} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText(/export 2 repositories/i)).toBeInTheDocument();
  });

  it('should show all export options', () => {
    render(<ExportMenu repos={mockRepos} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('JSON File')).toBeInTheDocument();
    expect(screen.getByText('CSV File')).toBeInTheDocument();
    expect(screen.getByText('Markdown File')).toBeInTheDocument();
    expect(screen.getByText('Copy Links')).toBeInTheDocument();
  });

  it('should call exportToJSON when JSON option is clicked', () => {
    const exportToJSONSpy = vi.spyOn(exportUtils, 'exportToJSON');

    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('JSON File'));

    expect(exportToJSONSpy).toHaveBeenCalledWith(mockRepos);
  });

  it('should call exportToCSV when CSV option is clicked', () => {
    const exportToCSVSpy = vi.spyOn(exportUtils, 'exportToCSV');

    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('CSV File'));

    expect(exportToCSVSpy).toHaveBeenCalledWith(mockRepos);
  });

  it('should call exportToMarkdown when Markdown option is clicked', () => {
    const exportToMarkdownSpy = vi.spyOn(exportUtils, 'exportToMarkdown');

    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Markdown File'));

    expect(exportToMarkdownSpy).toHaveBeenCalledWith(mockRepos);
  });

  it('should call copyLinksToClipboard when Copy Links is clicked', async () => {
    const copyLinksSpy = vi.spyOn(exportUtils, 'copyLinksToClipboard').mockResolvedValue(true);

    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Copy Links'));

    await waitFor(() => {
      expect(copyLinksSpy).toHaveBeenCalledWith(mockRepos);
    });
  });

  it('should show success message after copying links', async () => {
    vi.spyOn(exportUtils, 'copyLinksToClipboard').mockResolvedValue(true);

    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Copy Links'));

    await waitFor(() => {
      expect(screen.getByText(/links copied to clipboard/i)).toBeInTheDocument();
    });
  });

  it('should close menu after selecting an option', () => {
    vi.spyOn(exportUtils, 'exportToJSON');

    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('JSON File')).toBeInTheDocument();

    fireEvent.click(screen.getByText('JSON File'));

    expect(screen.queryByText('JSON File')).not.toBeInTheDocument();
  });

  it('should close menu when clicking outside', () => {
    render(<ExportMenu repos={mockRepos} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('JSON File')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('JSON File')).not.toBeInTheDocument();
  });
});

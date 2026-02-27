import type { GitHubRepo } from '../types/github';

export const exportToJSON = (repos: GitHubRepo[]) => {
  const data = repos.map(repo => ({
    name: repo.name,
    full_name: repo.full_name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    owner: repo.owner.login,
    owner_url: repo.owner.html_url,
    updated_at: repo.updated_at,
  }));

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `github-favorites-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (repos: GitHubRepo[]) => {
  const headers = ['Name', 'Full Name', 'URL', 'Description', 'Stars', 'Forks', 'Language', 'Owner', 'Owner URL', 'Updated At'];
  const rows = repos.map(repo => [
    repo.name,
    repo.full_name,
    repo.html_url,
    repo.description || 'N/A',
    repo.stargazers_count,
    repo.forks_count,
    repo.language || 'N/A',
    repo.owner.login,
    repo.owner.html_url,
    repo.updated_at,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `github-favorites-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyLinksToClipboard = async (repos: GitHubRepo[]): Promise<boolean> => {
  const links = repos.map(repo => `${repo.full_name}: ${repo.html_url}`).join('\n');

  try {
    await navigator.clipboard.writeText(links);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

export const exportToMarkdown = (repos: GitHubRepo[]) => {
  const markdown = [
    '# My GitHub Favorites',
    '',
    `Exported on ${new Date().toLocaleDateString()}`,
    '',
    ...repos.map(repo => {
      return [
        `## [${repo.full_name}](${repo.html_url})`,
        '',
        repo.description || 'No description',
        '',
        `- ⭐ Stars: ${repo.stargazers_count.toLocaleString()}`,
        `- 🍴 Forks: ${repo.forks_count.toLocaleString()}`,
        repo.language ? `- 💻 Language: ${repo.language}` : '',
        `- 👤 Owner: [@${repo.owner.login}](${repo.owner.html_url})`,
        `- 🔄 Updated: ${new Date(repo.updated_at).toLocaleDateString()}`,
        '',
      ].filter(Boolean).join('\n');
    })
  ].join('\n');

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `github-favorites-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

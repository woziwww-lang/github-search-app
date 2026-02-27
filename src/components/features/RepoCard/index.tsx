import type { GitHubRepo } from '../../../types/github';
import { formatNumber, formatDate } from '../../../utils/format';

interface RepoCardProps {
  repo: GitHubRepo;
  isFavorite?: boolean;
  onToggleFavorite?: (repo: GitHubRepo) => void;
}

export const RepoCard = ({ repo, isFavorite = false, onToggleFavorite }: RepoCardProps) => {
  return (
    <div className="border border-gray-800 rounded-xl p-5 bg-gray-800/30 transition-all duration-200
                    hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 relative">
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(repo)}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-200
                     hover:bg-gray-700/50 hover:scale-110"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <svg className="w-6 h-6 fill-yellow-500" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 stroke-gray-400 fill-none hover:stroke-yellow-500" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </button>
      )}

      <div className="flex gap-4 mb-4 pr-10">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-12 h-12 rounded-full border-2 border-gray-700"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-words"
            >
              {repo.full_name}
            </a>
          </h3>
          <a
            href={repo.owner.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            @{repo.owner.login}
          </a>
        </div>
      </div>

      <p className="text-gray-400 leading-relaxed mb-4 h-[72px] line-clamp-3 overflow-hidden">
        {repo.description || 'No description provided'}
      </p>

      <div className="flex flex-wrap gap-4 py-4 border-t border-b border-gray-700/50">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-base">⭐</span>
          <span>{formatNumber(repo.stargazers_count)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-base">🍴</span>
          <span>{formatNumber(repo.forks_count)}</span>
        </div>
        {repo.language && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span>{repo.language}</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <span className="text-xs text-gray-500">
          Updated {formatDate(repo.updated_at)}
        </span>
      </div>
    </div>
  );
};

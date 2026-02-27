import type { GitHubRepo } from '../../../types/github';
import { formatNumber, formatDate } from '../../../utils/format';

interface RepoCardProps {
  repo: GitHubRepo;
  isFavorite?: boolean;
  onToggleFavorite?: (repo: GitHubRepo) => void;
}

export const RepoCard = ({ repo, isFavorite = false, onToggleFavorite }: RepoCardProps) => {
  return (
    <article className="border border-gray-800 rounded-xl p-4 md:p-5 bg-gray-800/30 transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 relative
                    group">
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(repo)}
          className="absolute top-3 md:top-4 right-3 md:right-4 p-2 rounded-lg transition-all duration-200
                     hover:bg-gray-700/50 hover:scale-110 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <svg className="w-5 h-5 md:w-6 md:h-6 fill-yellow-500 drop-shadow-lg" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6 stroke-gray-400 fill-none transition-colors group-hover:stroke-yellow-400" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </button>
      )}

      <div className="flex gap-3 md:gap-4 mb-4 pr-8 md:pr-10">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-700 transition-transform group-hover:scale-110"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base md:text-lg mb-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-words transition-colors"
            >
              {repo.full_name}
            </a>
          </h3>
          <a
            href={repo.owner.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm text-gray-500 hover:text-primary transition-colors"
          >
            @{repo.owner.login}
          </a>
        </div>
      </div>

      <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4 min-h-[60px] md:min-h-[72px] line-clamp-3 overflow-hidden">
        {repo.description || 'No description provided'}
      </p>

      <div className="flex flex-wrap gap-3 md:gap-4 py-3 md:py-4 border-t border-b border-gray-700/50">
        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-400 hover:text-white transition-colors">
          <span className="text-sm md:text-base">⭐</span>
          <span className="font-medium">{formatNumber(repo.stargazers_count)}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-400 hover:text-white transition-colors">
          <span className="text-sm md:text-base">🍴</span>
          <span className="font-medium">{formatNumber(repo.forks_count)}</span>
        </div>
        {repo.language && (
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-primary font-medium">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary animate-pulse-subtle"></span>
            <span>{repo.language}</span>
          </div>
        )}
      </div>

      <div className="mt-2 md:mt-3">
        <span className="text-xs text-gray-500">
          Updated {formatDate(repo.updated_at)}
        </span>
      </div>
    </article>
  );
};

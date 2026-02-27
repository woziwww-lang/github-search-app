interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      className={`group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg
                  ${isDark
                    ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 hover:from-primary/30 hover:to-primary-dark/30 border-2 border-gray-700 hover:border-primary/60 hover:shadow-primary/40'
                    : 'bg-gradient-to-br from-white to-gray-50 hover:from-primary/20 hover:to-primary-dark/20 border-2 border-gray-300 hover:border-primary/60 hover:shadow-primary/40'
                  }`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" strokeWidth="2" className="text-yellow-400" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
            className="text-yellow-400"
          />
        </svg>

        {/* Moon icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            className="text-indigo-400"
          />
        </svg>
      </div>

      {/* Tooltip */}
      <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs rounded-lg
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200
                       pointer-events-none whitespace-nowrap shadow-xl
                       ${isDark
                         ? 'bg-gray-900 text-white border border-gray-700'
                         : 'bg-white text-gray-900 border border-gray-300'
                       }`}>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45
                         ${isDark
                           ? 'bg-gray-900 border-l border-t border-gray-700'
                           : 'bg-white border-l border-t border-gray-300'
                         }`}></div>
      </div>
    </button>
  );
};

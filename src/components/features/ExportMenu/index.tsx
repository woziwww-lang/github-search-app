import { useState, useRef, useEffect } from 'react';
import type { GitHubRepo } from '../../../types/github';
import { exportToJSON, exportToCSV, copyLinksToClipboard, exportToMarkdown } from '../../../utils/exportFavorites';

interface ExportMenuProps {
  repos: GitHubRepo[];
  disabled?: boolean;
}

export const ExportMenu = ({ repos, disabled = false }: ExportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleCopyLinks = async () => {
    const success = await copyLinksToClipboard(repos);
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
    setIsOpen(false);
  };

  const handleExport = (type: 'json' | 'csv' | 'markdown') => {
    if (type === 'json') exportToJSON(repos);
    else if (type === 'csv') exportToCSV(repos);
    else if (type === 'markdown') exportToMarkdown(repos);
    setIsOpen(false);
  };

  if (repos.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-primary/80
                   text-gray-300 hover:text-white rounded-lg transition-all hover:scale-105
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   border border-gray-700 hover:border-primary/50 shadow-md hover:shadow-lg
                   hover:shadow-primary/30"
        title="Export favorites"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium">Export</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 dark:bg-gray-800
                        border border-gray-700 rounded-lg shadow-2xl shadow-black/50
                        overflow-hidden z-50 animate-fade-in backdrop-blur-sm">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Export {repos.length} {repos.length === 1 ? 'Repository' : 'Repositories'}
            </div>

            <button
              onClick={() => handleExport('json')}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700/50
                         transition-colors flex items-center gap-3"
            >
              <span className="text-lg">📄</span>
              <div>
                <div className="font-medium">JSON File</div>
                <div className="text-xs text-gray-500">Structured data format</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700/50
                         transition-colors flex items-center gap-3"
            >
              <span className="text-lg">📊</span>
              <div>
                <div className="font-medium">CSV File</div>
                <div className="text-xs text-gray-500">Open in Excel/Sheets</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('markdown')}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700/50
                         transition-colors flex items-center gap-3"
            >
              <span className="text-lg">📝</span>
              <div>
                <div className="font-medium">Markdown File</div>
                <div className="text-xs text-gray-500">README format</div>
              </div>
            </button>

            <div className="my-2 border-t border-gray-700/50"></div>

            <button
              onClick={handleCopyLinks}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700/50
                         transition-colors flex items-center gap-3"
            >
              <span className="text-lg">📋</span>
              <div>
                <div className="font-medium">Copy Links</div>
                <div className="text-xs text-gray-500">Copy to clipboard</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {showCopiedMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500
                        text-white rounded-lg shadow-lg animate-fade-in z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Links copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const [jumpPage, setJumpPage] = useState('');

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpPage('');
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10 px-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 rounded-lg border border-gray-700 bg-gray-800/50 transition-all
                   hover:bg-primary hover:border-primary hover:-translate-y-0.5
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-gray-800/50"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1 items-center">
        {/* First page */}
        {currentPage > 2 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="min-w-[40px] px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                         hover:bg-primary/30 transition-all"
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Previous page */}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="min-w-[40px] px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                       hover:bg-primary/30 transition-all"
          >
            {currentPage - 1}
          </button>
        )}

        {/* Current page */}
        <button
          className="min-w-[40px] px-3 py-2 rounded-lg border border-primary bg-primary
                     font-semibold cursor-default"
        >
          {currentPage}
        </button>

        {/* Next page */}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="min-w-[40px] px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                       hover:bg-primary/30 transition-all"
          >
            {currentPage + 1}
          </button>
        )}

        {/* Last page */}
        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="min-w-[40px] px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                         hover:bg-primary/30 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2 rounded-lg border border-gray-700 bg-gray-800/50 transition-all
                   hover:bg-primary hover:border-primary hover:-translate-y-0.5
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-gray-800/50"
      >
        Next
      </button>

      {/* Jump to Page */}
      <form onSubmit={handleJumpToPage} className="flex items-center gap-2 ml-4">
        <span className="text-sm text-gray-400">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder="Page"
          className="w-16 px-2 py-2 text-center rounded-lg border border-gray-700 bg-gray-800/50
                     text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 transition-all
                     hover:bg-primary hover:border-primary
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50"
        >
          Go
        </button>
      </form>
    </div>
  );
};

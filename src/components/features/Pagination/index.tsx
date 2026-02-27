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

  const handleJumpToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpPage('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-2 mt-10 mb-8 md:mb-10 px-4 pb-safe">
      {/* Mobile: Current page info */}
      <div className="md:hidden text-center text-sm text-gray-400 mb-2">
        Page {currentPage} of {totalPages}
      </div>

      {/* Navigation buttons and page numbers */}
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 md:px-5 py-2 rounded-lg border border-gray-700 bg-gray-800/50 transition-all
                     hover:bg-primary hover:border-primary hover:-translate-y-0.5
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-gray-800/50
                     text-sm md:text-base"
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1 items-center">
        {/* First page */}
        {currentPage > 2 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="min-w-[36px] md:min-w-[40px] px-2 md:px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                         hover:bg-primary/30 transition-all text-sm md:text-base"
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="px-1 md:px-2 text-gray-500 text-sm">...</span>
            )}
          </>
        )}

        {/* Previous page */}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="min-w-[36px] md:min-w-[40px] px-2 md:px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                       hover:bg-primary/30 transition-all text-sm md:text-base"
          >
            {currentPage - 1}
          </button>
        )}

        {/* Current page */}
        <button
          className="min-w-[36px] md:min-w-[40px] px-2 md:px-3 py-2 rounded-lg border border-primary bg-primary
                     font-semibold cursor-default text-sm md:text-base"
        >
          {currentPage}
        </button>

        {/* Next page */}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="min-w-[36px] md:min-w-[40px] px-2 md:px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                       hover:bg-primary/30 transition-all text-sm md:text-base"
          >
            {currentPage + 1}
          </button>
        )}

        {/* Last page */}
        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="px-1 md:px-2 text-gray-500 text-sm">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="min-w-[36px] md:min-w-[40px] px-2 md:px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50
                         hover:bg-primary/30 transition-all text-sm md:text-base"
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
          className="px-4 md:px-5 py-2 rounded-lg border border-gray-700 bg-gray-800/50 transition-all
                     hover:bg-primary hover:border-primary hover:-translate-y-0.5
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-gray-800/50
                     text-sm md:text-base"
        >
          Next
        </button>
      </div>

      {/* Jump to Page - Full width on mobile */}
      <form onSubmit={handleJumpToPage} className="flex items-center justify-center gap-2 w-full md:w-auto md:ml-4 mt-3 md:mt-0">
        <span className="text-xs md:text-sm text-gray-400">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder="Page"
          className="w-14 md:w-16 px-2 py-2 text-center rounded-lg border border-gray-700 bg-gray-800/50
                     text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors
                     text-sm md:text-base"
        />
        <button
          type="submit"
          disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
          className="px-3 md:px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 transition-all
                     hover:bg-primary hover:border-primary
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50
                     text-sm md:text-base"
        >
          Go
        </button>
      </form>
    </div>
  );
};

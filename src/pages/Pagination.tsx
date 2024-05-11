import React from 'react';

interface Props {
  entries: number;
  ataTime: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ entries, ataTime, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(entries / ataTime);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Previous Button */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-start">
        <button
          onClick={handlePreviousClick}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* Pagination Info */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <p className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">{Math.min((currentPage - 1) * ataTime + 1, entries)}</span>{' '}
          to{' '}
          <span className="font-medium">{Math.min(currentPage * ataTime, entries)}</span>{' '}
          of{' '}
          <span className="font-medium">{entries}</span>{' '}
          results
        </p>
      </div>
      {/* Next Button */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

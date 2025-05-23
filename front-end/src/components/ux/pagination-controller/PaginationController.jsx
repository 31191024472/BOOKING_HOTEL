import React from 'react';

/**
 * Component PaginationController để phân trang kết quả tìm kiếm.
 * @param {Object} props - Props của component.
 * @param {number} props.currentPage - Số trang hiện tại.
 * @param {number} props.totalPages - Tổng số trang.
 * @param {Function} props.handlePageChange - Hàm xử lý khi thay đổi trang.
 * @param {Function} props.handlePreviousPageChange - Hàm xử lý khi chuyển đến trang trước.
 * @param {Function} props.handleNextPageChange - Hàm xử lý khi chuyển đến trang tiếp theo.
 *
 * @returns {JSX.Element} Component đã được render.
 *
 * @example
 * return (
 *  <PaginationController
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   handlePageChange={handlePageChange}
 *   handlePreviousPageChange={handlePreviousPageChange}
 *   handleNextPageChange={handleNextPageChange}
 *  />
 * );
 *
 */
const PaginationController = (props) => {
  const {
    currentPage,
    totalPages,
    handlePageChange,
    handlePreviousPageChange,
    handleNextPageChange,
  } = props;

  const isNextDisabled = currentPage >= totalPages ? true : false;

  const isPreviousDisabled = currentPage <= 1 ? true : false;

  return (
    <div className="pagination flex justify-center border-t">
      <nav className="mt-2">
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <button
              disabled={isPreviousDisabled ? true : false}
              onClick={handlePreviousPageChange}
              className={`${
                isPreviousDisabled && 'cursor-not-allowed'
              } flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700`}
            >
              <span className="sr-only">Trước</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i}>
              <button
                onClick={() => handlePageChange(i + 1)}
                className={`${
                  parseInt(currentPage) === i + 1
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-500'
                }  flex items-center justify-center px-3 h-8 leading-tight  border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              disabled={isNextDisabled ? true : false}
              onClick={handleNextPageChange}
              className={`${
                isNextDisabled && 'cursor-not-allowed'
              } flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700`}
            >
              <span className="sr-only">Tiếp</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationController;

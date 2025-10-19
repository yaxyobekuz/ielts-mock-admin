// React
import { memo, useEffect } from "react";

// Components
import Button from "./form/Button";

// Icons
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable Pagination Component
 * @param {Object} props
 * @param {number} props.currentPage - Current active page number
 * @param {number} props.totalPages - Total number of pages
 * @param {boolean} props.hasNextPage - Whether there is a next page
 * @param {boolean} props.hasPrevPage - Whether there is a previous page
 * @param {function} props.onPageChange - Callback function when page changes
 * @param {boolean} props.showPageNumbers - Whether to show page number buttons (default: true)
 * @param {number} props.maxPageButtons - Maximum number of page buttons to show (default: 5)
 * @param {string} props.className - Additional CSS classes for the container
 */
const Pagination = ({
  currentPage,
  onPageChange,
  totalPages = 1,
  className = "",
  maxPageButtons = 5,
  hasNextPage = false,
  hasPrevPage = false,
  showPageNumbers = true,
}) => {
  // Don't render if only one page
  if (totalPages <= 1 && !showPageNumbers) {
    return null;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfMaxButtons = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - halfMaxButtons);
    let endPage = Math.min(totalPages, currentPage + halfMaxButtons);

    // Adjust if we're near the start or end
    if (currentPage <= halfMaxButtons) {
      endPage = Math.min(totalPages, maxPageButtons);
    } else if (currentPage >= totalPages - halfMaxButtons) {
      startPage = Math.max(1, totalPages - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showFirstPage = totalPages > maxPageButtons && pageNumbers[0] > 1;
  const showLastPage =
    totalPages > maxPageButtons &&
    pageNumbers[pageNumbers.length - 1] < totalPages;
  const showStartEllipsis = showFirstPage && pageNumbers[0] > 2;
  const showEndEllipsis =
    showLastPage && pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  return (
    <div className={`flex items-center justify-center gap-3.5 ${className}`}>
      {/* Previous Button */}
      <Button
        size="lg"
        variant="neutral"
        className="gap-2"
        onClick={goToPrevPage}
        disabled={!hasPrevPage}
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft size={20} className="-translate-x-0.5" />
        <span>Oldingi</span>
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-3.5">
          {/* First Page */}
          {showFirstPage && (
            <>
              <Button
                size="lg"
                variant="neutral"
                className="w-10 !px-0"
                aria-label={`1-sahifa`}
                onClick={() => goToPage(1)}
              >
                1
              </Button>

              {showStartEllipsis && (
                <span className="px-2 text-gray-400">...</span>
              )}
            </>
          )}

          {/* Page Number Buttons */}
          {pageNumbers.map((pageNum) => (
            <Button
              size="lg"
              key={pageNum}
              className="w-10 !px-0"
              aria-label={`${pageNum}-sahifa`}
              onClick={() => goToPage(pageNum)}
              variant={pageNum === currentPage ? "primary" : "neutral"}
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              {pageNum}
            </Button>
          ))}

          {/* Last Page */}
          {showLastPage && (
            <>
              {showEndEllipsis && (
                <span className="px-2 text-gray-400">...</span>
              )}

              <Button
                size="lg"
                variant="neutral"
                className="w-10 !px-0"
                aria-label={`${totalPages}-sahifa`}
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Current Page Only (when showPageNumbers is false) */}
      {!showPageNumbers && (
        <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">
          {currentPage}
        </span>
      )}

      {/* Next Button */}
      <Button
        size="lg"
        variant="neutral"
        className="gap-2"
        onClick={goToNextPage}
        disabled={!hasNextPage}
        aria-label="Keyingi sahifa"
      >
        <span>Keyingi</span>
        <ChevronRight size={20} className="translate-x-0.5" />
      </Button>
    </div>
  );
};

export default memo(Pagination);

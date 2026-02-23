import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

/**
 * Google-style pagination component with page numbers
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current page (0-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onPageChange - Callback when page changes
 * @param {number} props.totalItems - Total number of items (optional, for "Showing X-Y of Z")
 * @param {number} props.itemsPerPage - Items per page (default: 20)
 */
export default function Pagination({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  totalItems = null,
  itemsPerPage = 20,
}) {
  if (totalPages <= 1) return null; // Don't show pagination if only 1 page

  /**
   * Generate page numbers with ellipsis (...)
   * Examples:
   *   Page 1:  [1] 2 3 4 5 ... 55
   *   Page 3:  1 2 [3] 4 5 ... 55
   *   Page 30: 1 ... 28 29 [30] 31 32 ... 55
   *   Page 55: 1 ... 51 52 53 54 [55]
   */
  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2; // How many pages to show on each side of current page

    // Always show first page
    pages.push(0);

    // Calculate range around current page
    const rangeStart = Math.max(1, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 2, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 1) {
      pages.push("ellipsis-start");
    }

    // Add pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 2) {
      pages.push("ellipsis-end");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Calculate "Showing X-Y of Z" text
  const showingFrom = currentPage * itemsPerPage + 1;
  const showingTo = Math.min((currentPage + 1) * itemsPerPage, totalItems || 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pb-6">
      {/* Left: "Showing X-Y of Z" */}
      {totalItems && (
        <div className="text-sm text-theme-text-secondary order-2 sm:order-1">
          Zeige <span className="font-medium text-theme-text-primary">{showingFrom}-{showingTo}</span> von{" "}
          <span className="font-medium text-theme-text-primary">{totalItems}</span> Konversationen
        </div>
      )}

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === 0
              ? "bg-theme-bg-secondary text-theme-text-disabled cursor-not-allowed"
              : "bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-hover"
          }`}
          title="Vorherige Seite"
        >
          <CaretLeft size={16} weight="bold" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            // Ellipsis
            if (typeof page === "string") {
              return (
                <span
                  key={`${page}-${index}`}
                  className="px-2 py-1 text-theme-text-secondary"
                >
                  ...
                </span>
              );
            }

            // Page number
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-primary-button text-white"
                    : "bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-hover"
                }`}
              >
                {page + 1}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className={`p-2 rounded-lg transition-colors ${
            currentPage >= totalPages - 1
              ? "bg-theme-bg-secondary text-theme-text-disabled cursor-not-allowed"
              : "bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-hover"
          }`}
          title="Nächste Seite"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}

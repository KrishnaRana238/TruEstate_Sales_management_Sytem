import '../styles/Pagination.css';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) {
    return null;
  }

  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="pagination-btn pagination-prev"
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className="pagination-pages">
        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`pagination-page ${page === currentPage ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={!hasNextPage}
        className="pagination-btn pagination-next"
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;

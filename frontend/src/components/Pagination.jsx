export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const maxVisiblePages = 5; // 最多显示5个页码
  
    // 生成页码按钮
    const renderPageNumbers = () => {
      const pages = [];
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
      // 调整起始页码以确保显示完整的分页范围
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
  
      // 添加第一页和省略号（如果需要）
      if (startPage > 1) {
        pages.push(
          <button key={1} onClick={() => onPageChange(1)} className="page-number">
            1
          </button>
        );
        if (startPage > 2) {
          pages.push(
            <span key="left-ellipsis" className="ellipsis">
              ...
            </span>
          );
        }
      }
  
      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`page-number ${i === currentPage ? "active" : ""}`}
          >
            {i}
          </button>
        );
      }
  
      // 添加最后一页和省略号（如果需要）
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <span key="right-ellipsis" className="ellipsis">
              ...
            </span>
          );
        }
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className="page-number"
          >
            {totalPages}
          </button>
        );
      }
  
      return pages;
    };
  
    return (
      <div className="pagination">
        <button
          className="page-nav"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          上一页
        </button>
  
        {renderPageNumbers()}
  
        <button
          className="page-nav"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          下一页
        </button>
      </div>
    );
  }
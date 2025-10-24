export const Pagination = ({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) => {
  return (
    <nav>
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPage(page - 1)}>
            «
          </button>
        </li>
        <li className="page-item disabled">
          <span className="page-link">
            {page} / {pages}
          </span>
        </li>
        <li className={`page-item ${page >= pages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPage(page + 1)}>
            »
          </button>
        </li>
      </ul>
    </nav>
  );
};

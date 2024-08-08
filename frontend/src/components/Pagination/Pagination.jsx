import styles from "./Pagination.module.css";
export const Pagination = ({ page, setPage, totalPages }) => {
  // console.log(page,totalPages)
  return (
    <>
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => {
            setPage(parseInt(page) - 1);
          }}
        >
          Prev
        </button>
        <p>{page ? page : 1}</p>
        <button
          disabled={page === parseInt(totalPages)}
          onClick={() => {
            setPage(parseInt(page) + 1);
          }}
        >
          Next
        </button>
       {
        totalPages !== 0 ?  <p>{parseInt(page)} of {parseInt(totalPages)} pages</p> : null
       }
      </div>
    </>
  );
};

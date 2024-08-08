import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import { baseUrl } from "../../comman.js";
import { NavLink, useSearchParams } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination.jsx";
import { Navbar } from "../../components/Navbar/Navbar.jsx";
import { RxCross2 } from "react-icons/rx";
import ReactLoading from "react-loading";

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState({});
  const [booksForSearch, setBooksForSearch] = useState([]);
  // const [booksForPriceFilter, setBooksForPriceFilter] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [uniqueGenre, setUniqueGenre] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading,setIsLoading] = useState(false)
  const [showTextForPaidBook, setShowTextForPaidBook] = useState(false);
  const [pageLimit, setPageLimit] = useState(
    searchParams.get("pageLimit") || 10
  );
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "asc"
  ); // Default sort order

  const test = searchParams.get("page");
  console.log("test", test);
  // Get all books
  const handleGetAllBooks = async () => {
    console.log(pageLimit);
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${baseUrl}/books/?page=${page}&pageLimit=${pageLimit}&sortOrder=${sortOrder}`
      );
      if (response) {
        console.log(response);
        setBooks(response?.data?.books);
        setTotalPages(response?.data?.totalPages);
        setBooksForSearch(response?.data.totalBooks);
        // setBooksForPriceFilter(response?.data?.books);
        setIsLoading(false)
      } else {
        console.log(response?.data?.error);
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };

  // Search book by title
  const handleSearchBookByTitle = async (event) => {
    const query = event.target.value;

    const filtered = booksForSearch.filter((review, index) => {
      return review?.title.toLowerCase().includes(query.toLowerCase());
    });

    setBooks(filtered);
  };

  // Filter books by authors
  const filterBooksByAuthors = async (event) => {
    try {
      const author = event.target.value;
      if (author === "all") {
        setBooks(booksForSearch);
      } else {
        const filterdBooks = booksForSearch.filter((book, index) => {
          return book.author.name === author;
        });
        setBooks(filterdBooks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter books by genre
  const filterBooksByGenre = async (event) => {
    try {
      const genre = event.target.value;
      if (genre === "all") {
        setBooks(booksForSearch);
      } else {
        const filterdBooks = booksForSearch.filter((book, index) => {
          return book.genre === genre;
        });
        setBooks(filterdBooks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Unique authors and genres
  useEffect(() => {
    // Extract unique authors
    const authorsSet = new Set(booksForSearch.map((book) => book.author.name));
    setUniqueAuthors([...authorsSet]);

    // Extract unique genres
    const genresSet = new Set(booksForSearch.map((book) => book.genre));
    setUniqueGenre([...genresSet]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  useEffect(() => {
    handleGetAllBooks();
    setSearchParams({
      page,
      pageLimit,
      sortOrder,
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLimit, page, sortOrder]);

  // console.log(sliderValue);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <ReactLoading type="spin" color="#00BFFF" height={40} width={40} />
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Search / filter section  */}
        <div className={styles.actionsContainer}>
          <input
            type="search"
            placeholder="Search book by title"
            className={styles.search}
            onInput={handleSearchBookByTitle}
          />
          <div className={styles.author}>
            <label className={styles.label} htmlFor="selectAuthor">
              Select book by author
            </label>
            <br />
            <select
              className={styles.selectAuthor}
              id="selectAuthor"
              onChange={filterBooksByAuthors}
            >
              <option value="all">Select Author</option>
              {uniqueAuthors.map((author, index) => {
                return <option value={author}>{author}</option>;
              })}
            </select>
          </div>
          <div className={styles.genre}>
            <label className={styles.label} htmlFor="selectGenre">
              Select book by genre
            </label>
            <select
              className={styles.selectGenre}
              id="selectGenre"
              onChange={filterBooksByGenre}
            >
              <option value="all">Select Genre</option>
              {uniqueGenre.map((genre, index) => {
                return <option>{genre}</option>;
              })}
            </select>
          </div>
          <div className={styles.filterByPriceContainer}>
            <p className={styles.label}> Sort book by price</p>
            <div className={styles.sort}>
              <label>
                <input
                  name="sortOrder"
                  value="asc"
                  type="radio"
                  onChange={() => setSortOrder("asc")}
                  checked={sortOrder === "asc"}
                />
                Low To High
              </label>

              <label>
                <input
                  name="sortOrder"
                  value="desc"
                  type="radio"
                  onChange={() => setSortOrder("desc")}
                  checked={sortOrder === "desc"}
                />
                High To Low
              </label>
            </div>
          </div>

          {/* Select Book limits on per page  */}
          <div className={styles.pagination}>
            <h1 className={styles.label}>Select Books on per page</h1>
            <div className={styles.bookLimits}>
              <button onClick={() => setPageLimit(10)}>10</button>
              <button onClick={() => setPageLimit(30)}>30</button>
              <button onClick={() => setPageLimit(50)}>50</button>
            </div>
          </div>
        </div>

        {/* Home details  section */}
        <div className={styles.rightDiv}>
          <div className={styles.dataContainer}>
            <div className={styles.books}>
              {books.map((book, index) => {
                return (
                  <div className={styles.book}>
                    {/* Book image section  */}
                    <div className={styles.imgDiv}>
                      <img
                        className={styles.img}
                        src={book.cover}
                        alt={book.title}
                      />
                    </div>

                    {/* Book details section  */}
                    <div className={styles.bookDetails}>
                      <p
                        className={`${
                          book.isPaid ? styles.isPaid : styles.isFree
                        }`}
                      >
                        {book.isPaid ? "Paid" : "Free"}
                      </p>
                      <h1 className={styles.title}>{book?.title}</h1>
                      <p className={styles.price}> ₹{book.price} Only</p>
                      <p className={styles.description}>{book?.description}</p>
                      <div className={styles.tags}>
                        {
                          book.tags.map((tag)=>{
                            return <p>#{tag}</p>
                          })
                        }
                      </div>
                      <p className={styles.genre}>{book?.genre}</p>
                      {book.isPaid ? (
                        <button
                          onClick={() => {
                            setShowTextForPaidBook(true);
                          }}
                          className={styles.readBtn}
                        >
                          Buy Now
                        </button>
                      ) : (
                        <NavLink to={`/bookDetails/${book._id}`}>
                          <button className={styles.readBtn}>Read</button>
                        </NavLink>
                      )}
                      <p className={styles.author}>{book?.author.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.paginationCntainer}>
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              pageLimit={pageLimit}
            />
          </div>
        </div>
        {showTextForPaidBook && (
          <div className={styles.noPaid}>
            <div className={styles.crossDiv}>
              <RxCross2
                className={styles.cross}
                onClick={() => {
                  setShowTextForPaidBook(false);
                }}
              />
            </div>
            <p className={styles.text}>
              {" "}
              Stay tuned for our upcoming payment options. In the meantime,
              enjoy unlimited access to our free books!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

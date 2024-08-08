import { useContext, useEffect, useState } from "react";
import styles from "./AuthorLandingPage.module.css";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../comman";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { AuthorNavbar } from "../../authorComponents/AuthorNavbar/AuthorNavbar";
import { Pagination } from "../../../components/Pagination/Pagination";
import { MyContext } from "../../../context/MyContext";
import ReactLoading from "react-loading";

export const AuthorLandingPage = () => {
  const { authorLogin } = useContext(MyContext);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [booksForSearch, setBooksForSearch] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatedBook, setUpdatedBook] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [pageLimit, setPageLimit] = useState(
    searchParams.get("pageLimit") || 10
  );
  const [updateStatus, setUpdateStatus] = useState(
    searchParams.get("updateStatus") || "published"
  );
  const authorId= searchParams.get("author") || authorLogin.authorId;
  
  const [isAddLoadding, setAddIsLoadding] = useState(false);
  const [isUpdateLoadding, setUpdateIsLoadding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(authorLogin);

  // Get books by author id
  const handleGetBooks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseUrl}/books/getBookByAuthorId/${authorId}?page=${page}&pageLimit=${pageLimit}`,
        {
          headers: {
            "Content-Type": "application/json",
            // authorToken: authorData?.authorToken,
          },
        }
      );
      if (response.status === 200) {
        setBooks(response.data.books);
        setBooksForSearch(response.data.totalBooks);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response.data.error || "Unable to load books.");
    }
  };

  // Search book by title
  const handleSearchBookByTitle = async (event) => {
    const query = event.target.value;

    const filtered = booksForSearch.filter((book, index) => {
      return book?.title.toLowerCase().includes(query.toLowerCase());
    });

    setBooks(filtered);
  };

  //   Select book by status
  const selectBookByStatus = async (event) => {
    try {
      const value = event.target.value;

      if (value === "all") {
        setBooks(booksForSearch);
        return 0;
      }

      const selectBoooks = booksForSearch.filter((book, index) => {
        return book.status === value;
      });

      setBooks(selectBoooks);
    } catch (error) {
      console.log(error);
    }
  };

  //   Delete book by id
  const deleteBookById = async (id) => {
    try {
      const confirm = window.confirm(
        `Are you sure about delete book with ID "${id}"`
      );

      if (confirm) {
        const response = await axios.delete(
          `${baseUrl}/books/deleteBook/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorToken: authorLogin.authorToken,
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.success);
          handleGetBooks();
        }
      }
    } catch (error) {
      toast.error(
        error.response.data.error || `Unable to Delete Book with ID "${id}"`
      );
    }
  };

  // Handle update
  const handleUpdate = async (event) => {
    try {
      event.preventDefault();
      setUpdateIsLoadding(true);
      const response = await axios.patch(
        `${baseUrl}/books/updateBook/${updatedBook._id}`,
        updatedBook,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorToken: authorLogin?.authorToken,
          },
        }
      );

      console.log(response);
      if (response.status === 200) {
        setUpdateIsLoadding(false);
        toast.success(response.data.success);
      }

      setShowUpdateForm(false);
      handleGetBooks();
    } catch (error) {
      setUpdateIsLoadding(false);
      toast.error(
        error.response.data.error ||
          `Unable to update book with ID "${updatedBook._id}"`
      );
    }
  };

  // Handle input change
  const handleInput = (event) => {
    const { name, value, files } = event.target;

    if (name === "tags") {
      const featuresArray = value.split(",").map((feature) => feature.trim());
      setBook({ ...book, [name]: featuresArray });
    } else if (name === "cover") {
      setBook({ ...book, [name]: files[0] });
    } else {
      setBook({ ...book, [name]: value });
    }
  };

  // handle add book
  const handleAddBook = async (event) => {
    try {
      event.preventDefault();
      const addAuthorBook = { ...book, author: authorLogin.authorId };
      console.log(addAuthorBook, "here");
      // Adding Package data into the formData;
      const formData = new FormData();
      for (const key in addAuthorBook) {
        if (Array.isArray(addAuthorBook[key])) {
          addAuthorBook[key].forEach((item) =>
            formData.append(`${key}[]`, item)
          );
        } else {
          formData.append(key, addAuthorBook[key]);
        }
      }

      //   Sending add request
      setAddIsLoadding(true);
      const response = await axios.post(`${baseUrl}/books/addBook`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorToken: authorLogin.authorToken,
        },
      });

      if (response.status === 200) {
        setAddIsLoadding(false);
        toast.success(response.data.success);
        handleGetBooks();
        setShowAddForm(false);
      }
    } catch (error) {
      setAddIsLoadding(false);
      toast.error(error.response.data.error || `Unable to add book.`);
    }
  };

  //handle Change Status
  const handleChangeStatus = async (event, id) => {
    try {
      setUpdateStatus("draft");
      const statusObj = {
        status: event.target.checked ? "published" : "draft",
      };
      const response = await axios.patch(
        `${baseUrl}/books/updateBook/${id}`,
        statusObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorToken: authorLogin.authorToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          `${event.target.checked ? "Saved as published." : "Saved as draft."}`
        );
        handleGetBooks();
      }
    } catch (error) {
      toast.error(error.response.data.error || `Unable to change status.`);
    }
  };

  // Handle sort by date
  const handleSortByDate = async (value) => {
    try {
      let sortedBooks = [...booksForSearch];

      if (value === "asc") {
        sortedBooks.sort(
          (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
        );
      } else {
        sortedBooks.sort(
          (a, b) => new Date(a.publishDate) - new Date(b.publishDate)
        );
      }

      setBooks(sortedBooks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSearchParams({
      author: authorLogin?.authorId,
      updateStatus,
      page,
      pageLimit,
    });
    handleGetBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStatus, page, pageLimit]);

  console.log(books);

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
      <AuthorNavbar />
      {books.length > 0 ? (
        <div className={styles.container}>
          <div
            className={
              showUpdateForm || showAddForm ? "hidden" : styles.searchContainer
            }
          >
            <div className={styles.searchDiv}>
              <div
                className={styles.addBookBtnContainer}
                onClick={() => {
                  setShowAddForm(true);
                }}
              >
                <button className={styles.addBookBtn}>Add Book</button>
              </div>
              <input
                onInput={handleSearchBookByTitle}
                type="search"
                name=""
                id=""
                placeholder="Search books by title"
              />
            </div>
            <div className={styles.selectBookByStatus}>
              <label htmlFor="status" className={styles.label}>
                Select Book By Status
              </label>
              <select name="status" id="status" onChange={selectBookByStatus}>
                <option value="all">Select Book Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className={styles.sortByDate}>
              <label className={styles.label}>
                Sort books by published date
              </label>
              <div className={styles.newToOld}>
                <input
                  type="radio"
                  id="asc"
                  name="date"
                  onChange={() => handleSortByDate("asc")}
                />
                <label htmlFor="asc">New To Old</label>
              </div>
              <div className={styles.oldToNew}>
                <input
                  type="radio"
                  id="desc"
                  name="date"
                  onChange={() => {
                    handleSortByDate("desc");
                  }}
                />
                <label htmlFor="desc">Old To New</label>
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
          <div
            className={
              showUpdateForm || showAddForm ? "hidden" : styles.dataDiv
            }
          >
            <div className={styles.books}>
              {books?.map((book, index) => {
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
                      <div className={styles.isPublishContainer}>
                        <input
                          type="checkbox"
                          id="isPublish"
                          name=""
                          checked={updateStatus}
                          onChange={(event) => {
                            handleChangeStatus(event, book._id);
                          }}
                        />
                        <label htmlFor="isPublish">Publish</label>
                      </div>
                      <h1 className={styles.title}>{book?.title}</h1>
                      <p className={styles.price}> ₹{book.price} Only</p>
                      <p className={styles.description}>{book?.description}</p>
                      <div className={styles.tags}>
                        {book?.tags?.map((tag, index) => {
                          return <p>#{tag}</p>;
                        })}
                      </div>
                      <p className={styles.genre}>{book?.genre}</p>
                      <div className={styles.actionBtns}>
                        <button
                          className={styles.edit}
                          onClick={() => {
                            setShowUpdateForm(true);
                            setShowAddForm(false);
                            setUpdatedBook({
                              ...updatedBook,
                              _id: book._id,
                              title: book.title,
                              price: book.price,
                              description: book.description,
                              genre: book.genre,
                              tags: book.tags,
                              status: book.status,
                              isPaid: book.isPaid,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.delete}
                          onClick={() => deleteBookById(book._id)}
                        >
                          Delete
                        </button>
                      </div>
                      <button className={styles.readBtn}>Read Now</button>
                      <p className={styles.author}>{book?.author.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.paginationContainer}>
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </div>
          <div className={styles.formContainer}>
            {showUpdateForm && (
              <div className={styles.updateFormContainer}>
                <form className={styles.updateForm} onSubmit={handleUpdate}>
                  <RxCross2
                    className={styles.updateCross}
                    onClick={() => setShowUpdateForm(false)}
                  />
                  <h1 className={styles.heading}>Update details</h1>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={updatedBook.title}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        title: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={updatedBook.description}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        description: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={updatedBook.genre}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        genre: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name="price"
                    placeholder="price"
                    value={updatedBook.price}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        price: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name="tags"
                    placeholder="tags"
                    value={updatedBook.tags}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        tags: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name="status"
                    placeholder="status"
                    value={updatedBook.status}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        status: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name="isPaid"
                    placeholder="isPaid"
                    value={updatedBook.isPaid}
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        isPaid: event.target.value,
                      });
                    }}
                  />
                  <label htmlFor="cover">Cover Image</label>
                  <input
                    type="file"
                    name="cover"
                    id="cover"
                    onChange={(event) => {
                      setUpdatedBook({
                        ...updatedBook,
                        cover: event.target.files[0],
                      });
                    }}
                  />
                  <input
                    type="submit"
                    value="Update"
                    className={`${styles.updateBtn} ${
                      isUpdateLoadding ? "hidden" : ""
                    }`}
                  />
                  {isUpdateLoadding && (
                    <div className={styles.spinner}>
                      <ReactLoading
                        type="spin"
                        color="white"
                        height={20}
                        width={20}
                      />
                    </div>
                  )}
                </form>
              </div>
            )}

            {showAddForm && (
              <div className={styles.addFormContainer}>
                <form className={styles.addForm} onSubmit={handleAddBook}>
                  <RxCross2
                    className={styles.addCross}
                    onClick={() => setShowAddForm(false)}
                  />
                  <h1 className={styles.heading}>Add Book</h1>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="price"
                    placeholder="price"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="tags"
                    placeholder="tags"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="status"
                    placeholder="status"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="isPaid"
                    placeholder="isPaid"
                    onChange={handleInput}
                  />
                  <label htmlFor="cover">Cover Image</label>
                  <input
                    type="file"
                    name="cover"
                    id="cover"
                    onChange={handleInput}
                  />
                  <input
                    type="submit"
                    value="Add Book"
                    className={`${styles.addBtn} ${
                      isAddLoadding ? "hidden" : ""
                    }`}
                  />
                  {isAddLoadding && (
                    <div className={styles.spinner}>
                      <ReactLoading
                        type="spin"
                        color="white"
                        height={20}
                        width={20}
                      />
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.noBook}>
          <h1 className={styles.heading}>
            It looks like you haven't added any books yet. Please proceed to add
            one.
          </h1>
          <button className={styles.addBookBtn} onClick={()=>{setShowAddForm(!showAddForm)}}>Add Book</button>
          {showAddForm && (
              <div className={styles.addFormContainer}>
                <form className={styles.addForm} onSubmit={handleAddBook}>
                  <RxCross2
                    className={styles.addCross}
                    onClick={() => setShowAddForm(false)}
                  />
                  <h1 className={styles.heading}>Add Book</h1>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="price"
                    placeholder="price"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="tags"
                    placeholder="tags"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="status"
                    placeholder="status"
                    onChange={handleInput}
                  />
                  <input
                    type="text"
                    name="isPaid"
                    placeholder="isPaid"
                    onChange={handleInput}
                  />
                  <label htmlFor="cover">Cover Image</label>
                  <input
                    type="file"
                    name="cover"
                    id="cover"
                    onChange={handleInput}
                  />
                  <input
                    type="submit"
                    value="Add Book"
                    className={`${styles.addBtn} ${
                      isAddLoadding ? "hidden" : ""
                    }`}
                  />
                  {isAddLoadding && (
                    <div className={styles.spinner}>
                      <ReactLoading
                        type="spin"
                        color="white"
                        height={20}
                        width={20}
                      />
                    </div>
                  )}
                </form>
              </div>
            )}
        </div>
      )}
    </>
  );
};

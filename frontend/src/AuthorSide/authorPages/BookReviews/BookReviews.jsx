import { toast } from "react-toastify";
import { AuthorNavbar } from "../../authorComponents/AuthorNavbar/AuthorNavbar";
import styles from "./BookReview.module.css";
import axios from "axios";
import { baseUrl } from "../../../comman";
import { useContext, useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { MdDeleteForever } from "react-icons/md";
import { MyContext } from "../../../context/MyContext";
import ReactLoading from "react-loading";


export const BooksReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewForSearch, setReviewForSearch] = useState([]);
  const {authorLogin} = useContext(MyContext)
  const [isLoading,setIsLoading] = useState(false);
  

  // Handle get all reviews
  const handleGetReviews = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${baseUrl}/booksReviews/${authorLogin.authorId}`);
      if (response.status === 200) {
        setReviews(response.data.reverse());
        setReviewForSearch(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
      // toast.error(error.response.data.error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm(
        `Are you sure to delete review with id "${id}" .`
      );
      if (confirm) {
        const response = await axios.delete(
          `${baseUrl}/booksReviews/deleteReviewById/${id}`
        );

        if (response) {
          toast.success(response.data.success);
          handleGetReviews();
        }
      }
    } catch (error) {
      toast.error(error.response.data.error || "Unable to delete review");
    }
  };

  // handle search
  const handleSearch = (event) => {
    const query = event.target.value;

    const filtered = reviewForSearch.filter((review, index) => {
      return (
        review?.book.title.toLowerCase().includes(query.toLowerCase()) ||
        review?.book._id.toLowerCase().includes(query.toLowerCase())
      );
    });

    setReviews(filtered);
  };

  useEffect(() => {
    handleGetReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authorLogin]);

  // console.log(reviews);
  
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
     {reviews.length > 0 ? <div className={styles.reviewContainer}>
        <input
          type="search"
          onInput={handleSearch}
          className={styles.searchReview}
          placeholder="Search review by book Id or Title"
        />
        <div className={styles.reviews}>
          {reviews.map((review, index) => {
            return (
              <div className={styles.reviewDiv}>
                <button
                  className={styles.deleteReview}
                  onClick={() => handleDelete(review._id)}
                >
                  <MdDeleteForever />
                </button>
                <div className={styles.nameAndDate}>
                  <h1 className={styles.readerName}>
                    {review?.reader?.name?.charAt(0)?.toUpperCase() +
                      review?.reader?.name?.slice(1)}
                  </h1>
                  <span className={styles.dateSpan}>{review.reviewDate}</span>
                </div>
                <StarRatings
                  rating={review.rating}
                  starRatedColor="#f59e0b"
                  // changeRating={setRating}
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  className={styles.ratings}
                />
                <p className={styles.reviewText}>{review.reviewText}</p>
              </div>
            );
          })}
        </div>
      </div> : <div className={styles.noData}> <h1>Your books have not received any reviews yet.</h1></div>}
    </>
  );
};

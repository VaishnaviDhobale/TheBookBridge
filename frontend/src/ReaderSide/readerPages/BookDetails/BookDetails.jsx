import { ReaderNavbar } from "../../readerComponents/ReaderNavbar/ReaderNavbar";
import styles from "./BookDetails.module.css";
import BookPdfExample from "../../../booksPdfs/GYM Management .pdf";
import StarRatings from "react-star-ratings";
import { useContext, useState } from "react";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { BiHappyAlt } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { MyContext } from "../../../context/MyContext";
import axios from "axios";
import {baseUrl} from "../../../comman"
import { toast } from "react-toastify";
import ReactLoading from "react-loading";


export const BookDetails = () => {
  const [rating, setRating] = useState(1);
  const [reviewText,setReviewText] = useState()
  const [showFeedback, setShowFeedback] = useState(false);
  const {readerLogin} = useContext(MyContext);
  const [isLoading,setIsLoading] = useState(false)
  const bookId = useParams().bookId;
  

  const handleSubmit = async(event) => {
    try{
      event.preventDefault();
      const feedback = {
        book : bookId,
        reader : readerLogin.readerId,
        rating,
        reviewText
      }

      setIsLoading(true)
      const response = await axios.post(`${baseUrl}/booksReviews/addReview`, feedback,{
        headers : {
          "Content-Type" : "application/json",
          readerToken : readerLogin.readerToken
        }
      });

      if(response.status === 200){
        setIsLoading(false)
        toast.success(response.data.success);
      }
      console.log(response)
    }catch(error){

      setIsLoading(false)
      toast.error(error.response.data.error || "Unable to send feedback")
    }
  }

  console.log(rating);
  return (
    <>
      <ReaderNavbar />
      <div className={styles.bookDetailsContainer}>
        <button
          className={styles.feedback}
          onClick={() => setShowFeedback(!showFeedback)}
        >
          Give Feedback
        </button>
        {showFeedback && (
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.rating}>
              <p className={styles.reaction}>
                <RiEmotionUnhappyLine />
              </p>
              <StarRatings
                rating={rating}
                starRatedColor="#f59e0b"
                changeRating={setRating}
                numberOfStars={5}
                name="rating"
                starDimension="30px"
              />
              <p className={styles.reaction}>
                <BiHappyAlt />
              </p>
            </div>
            <textarea placeholder="Give Feedback" onChange={(event)=>setReviewText(event.target.value)}></textarea>
            <input
              type="submit"
              value="Submit Feedback"
              className={`${styles.submitBtn} ${
                isLoading ? "hidden" : ""
              }`}
            />
            {isLoading && (
            <div className={styles.spinner}>
              <ReactLoading type="spin" color="white" height={20} width={20} />
            </div>
          )}
          </form>
        )}
        <iframe
          src={BookPdfExample}
          frameborder="0"
          width="60%"
          // height="600px"
          className={styles.iframe}
          title="boook"
        ></iframe> 
      </div>
    </>
  );
};

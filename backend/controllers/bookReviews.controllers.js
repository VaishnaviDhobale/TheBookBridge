const { ReviewModel } = require("../models/bookReview.models");

// Get all book reviews
const getAllbookReviews = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Fetch all reviews and populate the necessary fields
    const booksReviews = await ReviewModel.find().populate("reader").populate({
      path: "book",
      populate: { path: "author" } // Ensure the author is also populated
    });

    // Filter reviews based on the author's ID
    const reviewByAuthor = booksReviews.filter((review) => {
      return review.book?.author?._id.toString() === id;
    });

    if (reviewByAuthor.length > 0) {
      res.status(200).send(reviewByAuthor);
    } else {
      res.status(400).send({ error: `No book reviews available at the moment.` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};


// Send feedback
const addReviews = async (req, res) => {
  try {
    const review = new ReviewModel(req.body);
    if (review) {
      await review.save();
      res.status(200).send({ success: `Feedback send successfully!` });
    } else {
      res
        .status(400)
        .send({ error: "Not able to send feedback, please try again." });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// Delete reviews 
const deleteReviewById = async(req,res) => {
  try{
    const id = req.params.id;
    const review = await ReviewModel.findById(id);
    if(review){
      await ReviewModel.findOneAndDelete({_id : id});
      res.status(200).send({success : `Review deleted successfully.`});
    }else{
      res.status(400).send({error : `Review not found with id "${id}"`});
    }
  }catch(error){
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
}

module.exports = {
  getAllbookReviews,
  addReviews,
  deleteReviewById
};

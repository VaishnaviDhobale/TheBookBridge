const express = require("express");

const upload = require("../middleware/upload.middleware");
const {
  getAllbookReviews,
  addReviews,
  deleteReviewById,
} = require("../controllers/bookReviews.controllers");

const bookReviewRouter = express.Router(); // create route for bookReview

// bookReview routes start
bookReviewRouter.route("/:id").get(getAllbookReviews); //  get all bookReviews
bookReviewRouter.route("/addReview").post(addReviews); //  get all bookReviews
bookReviewRouter.route("/deleteReviewById/:id").delete(deleteReviewById); //  delete all bookReviews
// bookReview routes ends

module.exports = {
  bookReviewRouter,
};

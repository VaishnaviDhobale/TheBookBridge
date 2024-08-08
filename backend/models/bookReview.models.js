const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  reader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  }
});

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = {
  ReviewModel,
};

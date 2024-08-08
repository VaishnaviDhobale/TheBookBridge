const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },

  summary: {
    type: String,
    // required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "published"], // Allowed values
    default: "draft", // Default to 'draft'
  },
  isPaid : {
    type : Boolean,
    required : true,
    default : false,
  },
  cover: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
});

const BookModel = mongoose.model("Book", bookSchema);

module.exports = {
  BookModel,
};

const express = require("express");

const upload = require("../middleware/upload.middleware");
const { authorAuth } = require("../middleware/authorAuth.middleware");
const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBookById,
  updateBookById,
  getBookById,
  getBookByAuthorId,
} = require("../controllers/book.controllers");

const bookRouter = express.Router(); // create route for book

// book routes start
bookRouter.route("/").get(getAllBooks); //  get all books
bookRouter.route("/getBookById/:id").get(getBookById); //  get book by id
bookRouter.route("/addBook").post(authorAuth, upload.single("cover"), addBook); // add book
bookRouter.route("/updateBook/:id").patch(authorAuth, upload.single("cover"), updateBookById); // update book
bookRouter.route("/deleteBook/:id").delete(authorAuth, deleteBookById); // update book
bookRouter.route("/getBookByAuthorId/:authorId").get(getBookByAuthorId); // get book by author Id

// book routes ends

module.exports = {
  bookRouter,
};

const { BookModel } = require("../models/book.models");
const { uploadOnClaoudinary } = require("../utils/cloudinary.utils");
const fs = require("fs");

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageLimit) || 10;
    const sortOrder = req.query.sortOrder || "asc";
    const books = await BookModel.find().populate("author");

    // sorting
    books.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price; // Ascending order
      } else {
        return b.price - a.price; // Descending order
      }
    });

    // Calculate the start and end index for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // send only published books
    const publishedBooks = books.filter((book, index) => {
      return book.status === "published";
    });

    // Slice the books array based on pagination parameters
    const paginatedBooks = publishedBooks.slice(startIndex, endIndex);
    // console.log(paginatedBooks);

    if (books.length > 0) {
      res.status(200).send({
        totalBooks: publishedBooks.length,
        totalPages: Math.ceil(publishedBooks.length / limit),
        currentPage: page,
        books: paginatedBooks,
        totalBooks: publishedBooks,
      });
    } else {
      res.status(400).send({ error: `No books available at the moment.` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};

// Get book by id
const getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findById(id);
    if (book) {
      res.status(200).send(book);
    } else {
      res.status(400).send({ error: `Book not found with id "${id}".` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};

// Get book by author id
const getBookByAuthorId = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageLimit) || 10;
    const book = await BookModel.find();

    console.log(authorId ,"herre")
    if (book.length > 0) {
      const booksByAuthor = book.filter((book, index) => {
        return book.author._id.toString() === authorId;
      });

      // Calculate the start and end index for pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      // Slice the books array based on pagination parameters
      const paginatedBooks = booksByAuthor.slice(startIndex, endIndex);
      // console.log(paginatedBooks);

      res.status(200).send({
        totalBooks: booksByAuthor.length,
        totalPages: Math.ceil(booksByAuthor.length / limit),
        currentPage: page,
        books: paginatedBooks,
        totalBooks: booksByAuthor,
      });
    } else {
      res.status(400).send({ error: `No books available at the moment.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};

// Add book
const addBook = async (req, res) => {
  try {
    const { title, description, genre, price, tags, summary, author, status } =
      req.body;

    console.log(req.file);

    // Checking for profileImg
    if (!req.file) {
      return res.status(400).send({ error: "No cover uploaded." });
    }

    // Cloudinary start
    const responseFromCloudinary = await uploadOnClaoudinary(req.file.path);
    if (responseFromCloudinary.url) {
      fs.unlinkSync(req.file.path); // Remove file after uploading
    } else {
      return res
        .status(500)
        .send({ error: "Failed to upload image to Cloudinary." });
    }
    // Cloudinary ends

    const book = new BookModel({
      title,
      description,
      genre,
      price: parseInt(price),
      tags,
      summary,
      author,
      status,
      cover: responseFromCloudinary.url,
    });

    await book.save();
    res.status(200).send({ success: "Book Successfully Added!" });
  } catch (error) {
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};

// Update book
const updateBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findOne({ _id: id });
    if (book) {
      if (req.file) {
        // Cloudinary start
        const responseFromCloudinary = await uploadOnClaoudinary(req.file.path);
        if (responseFromCloudinary.url) {
          fs.unlinkSync(req.file.path); // Remove file after uploading
        } else {
          return res
            .status(500)
            .send({ error: "Failed to upload image to Cloudinary." });
        }
        // Cloudinary ends

        await BookModel.findOneAndUpdate(
          { _id: id },
          { ...req.body, cover: responseFromCloudinary.url }
        );
        res.status(200).send({ success: `Book details updated successfully.` });
      } else {
        await BookModel.findOneAndUpdate({ _id: id }, req.body);
        res.status(200).send({ success: `Book details updated successfully.` });
      }
    } else {
      res.status(400).send({ error: `No book found with id "${id}".` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};

// Delete book by id
const deleteBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findById(id);
    if (book) {
      await BookModel.findOneAndDelete({ _id: id });
      res.status(200).send({ success: `Book deleted successfully.` });
    } else {
      res.status(400).send({ error: `Book not fount with this id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBookById,
  deleteBookById,
  getBookByAuthorId,
};

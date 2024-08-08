
const express = require("express");
const cors = require("cors");
const {connection} = require("./config/db");
const { authorRouter } = require("./routes/author.routes");
const { readerRouter } = require("./routes/reader.routes");
const { bookRouter } = require("./routes/book.routes");
const { bookReviewRouter } = require("./routes/bookReviews.routes");



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use("/authors", authorRouter);
app.use("/readers", readerRouter);
// app.use("/", readerRouter);
app.use("/books", bookRouter);
app.use("/booksReviews", bookReviewRouter);




// Database connection
app.listen(process.env.PORT || 8080, async () => {
  try {
    await connection;
    console.log("Connected with database!!");
    console.log(`Server running on port ${process.env.PORT}!`);
  } catch (error) {
    console.log(error);
  }
});

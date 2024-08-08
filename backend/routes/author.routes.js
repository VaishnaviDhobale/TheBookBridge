const express = require("express");

const upload = require("../middleware/upload.middleware");
const { getAllauthors, addAuthor, loginAuthor, getAuthorById, deleteAuthorById, updateAuthorById, authorByEmail } = require("../controllers/author.controllers");


const authorRouter = express.Router(); // create route for author auth

// author routes start 
authorRouter.route("/").get(getAllauthors); //  get all authors
authorRouter.route("/getAuthorById/:id").get(getAuthorById); //  get author by id
authorRouter.route("/addAuthor").post(upload.single("profileImg"),addAuthor); //  post authors
authorRouter.route("/loginAuthor").post(loginAuthor); //  Login authors
authorRouter.route("/deleteAuthorById/:id").delete(deleteAuthorById); // delete author by id
authorRouter.route("/updateAuthorById/:id").patch(upload.single("profileImg"),updateAuthorById); // update author by id
authorRouter.route("/authorByEmail/:emailId").get(authorByEmail); //  author by email true/false
// author routes ends 


module.exports = {
  authorRouter,
};

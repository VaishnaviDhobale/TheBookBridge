const express = require("express");

const upload = require("../middleware/upload.middleware");
const { getAllreaders, addReader, loginReader, getReaderById, deleteReaderById, updateReaderById, readerByEmail, emailVerify } = require("../controllers/reader.controllers");


const readerRouter = express.Router(); // create route for reader auth

// reader routes start 
readerRouter.route("/").get(getAllreaders); //  get all readers
readerRouter.route("/getReaderById/:id").get(getReaderById); //  get reader by id
readerRouter.route("/addReader").post(upload.single("profileImg"),addReader); //  add readers
readerRouter.route("/loginReader").post(loginReader); //  login readers
readerRouter.route("/deleteReaderById/:id").delete(deleteReaderById); //  delete reader by id
readerRouter.route("/updateReaderById/:id").patch(upload.single("profileImg"),updateReaderById); //  update reader by id
readerRouter.route("/readerByEmail/:emailId").get(readerByEmail); //  reader by email true/false
readerRouter.route("/verify/:token").get(emailVerify); //  email verification 
// reader routes ends 


module.exports = {
    readerRouter,
};

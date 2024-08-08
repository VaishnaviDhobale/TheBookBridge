const { AuthorModel } = require("../models/author.models");
const { uploadOnClaoudinary } = require("../utils/cloudinary.utils");
const fs = require("fs");
const bcrypt = require("bcrypt"); // To hash password
const JWT = require("jsonwebtoken"); // For generate unique token

// Add Author/ register
const addAuthor = async (req, res) => {
  try {
    const { name, bio, email, password, contact, nationality, awards, genres } =
      req.body;

    // Checking for profileImg
    if (!req.file) {
      return res.status(400).send({ error: "No profile img uploaded." });
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

    // Hash the password using bcrypt
    bcrypt.hash(password, 5, async (error, hash) => {
      if (error) {
        console.error("Error hashing password:", error);
        return res
          .status(500)
          .send({ error: "Failed to hash the password.", details: error });
      }

    //   console.log(hash);
      const author = new AuthorModel({
        name,
        email,
        password: hash,
        bio,
        contact,
        nationality,
        awards,
        genres,
        profileImg: responseFromCloudinary.url,
      });

      try {
        await author.save();
        res.status(200).send({ success: "Author Successfully Added!" });
      } catch (saveError) {
        console.error("Error saving author:", saveError);
        res
          .status(500)
          .send({ error: "Failed to save the author.", details: saveError });
      }
    });
  } catch (error) {
    res.status(500).send({ error: `Server Error`, details: error });
  }
};

// Login Author
const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Get author email from db
    const author = await AuthorModel.findOne({ email });

    // Compare password using bcrypt
    if (author) {
      bcrypt.compare(password, author.password, async (error, pass) => {
        if (pass) {
          const authorToken = JWT.sign({ text: "BookAuthor" }, "BookAuthor"); // authortoken created
          res.status(200).send({
            success: "Author has successfully logged in!",
            authorToken,
            authorId: author._id,
            profileImg: author.profileImg,
            authorEmail : author.email
          });
        } else {
          res.status(400).send({
            error: "Invalid password.",
          });
        }
      });
    } else {
      // User not found, send a message indicating the need for registration
      res.status(400).send({
        error:
          "It seems like you're new here. To proceed, please register an account.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: `Server Error`, details: error });
  }
};

// Get all Authors
const getAllauthors = async (req, res) => {
  try {
    const authors = await AuthorModel.find();
    if (authors.length > 0) {
      res.status(200).send(authors);
    } else {
      res.status(400).send({ error: `No authors available at the moment.` });
    }
  } catch (error) {
    res.status(500).send({ error: "Server Error", details: error });
  }
};

// Get author by id
const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await AuthorModel.findOne({ _id: id });
    if (author) {
      res.status(200).send(author);
    } else {
      res.status(400).send({ error: `Author not found with this id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// Delete authors by id
const deleteAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await AuthorModel.findById(id);
    if (author) {
      await AuthorModel.findOneAndDelete({ _id: id });
      res.status(200).send({ success: `Account deleted successfully.` });
    } else {
      res.status(400).send({ error: `Author not fount with this id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// update authors by id
const updateAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await AuthorModel.findOne({_id:id});
    if (author) {
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

        await AuthorModel.findOneAndUpdate(
          { _id: id },
          { ...req.body, profileImg: responseFromCloudinary.url }
        );
        res.status(200).send({ success: `Details updated successfully.` });

      } else {
        await AuthorModel.findOneAndUpdate({ _id: id }, req.body);
        res.status(200).send({ success: `Details updated successfully.` });
      }
    } else {
      res.status(400).send({ error: `Author not fount with this id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// Author by email true/false
const authorByEmail = async (req, res) => {
  try {
    const email = req.params.emailId;
    const author = await AuthorModel.find({ email: email });
    if (author.length) {
      res.status(200).send(true);
    } else {
      res.status(400).send(false);
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};


module.exports = {
  addAuthor,
  loginAuthor,
  getAllauthors,
  getAuthorById,
  deleteAuthorById,
  updateAuthorById,
  authorByEmail
};

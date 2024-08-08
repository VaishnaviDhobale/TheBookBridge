const { ReaderModel } = require("../models/reader.models");
const { uploadOnClaoudinary } = require("../utils/cloudinary.utils");
const fs = require("fs");
const bcrypt = require("bcrypt"); // To hash password
const JWT = require("jsonwebtoken"); // For generate unique token
const { sendVerificationEmail } = require("../utils/mailer");

// Add Reader/ register
const addReader = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // Checking for profileImg
    if (!req.file) {
      return res.status(400).send({ error: "No profile img uploaded." });
    }

    // Cloudinary start
    const responseFromCloudinary = await uploadOnClaoudinary(req.file.path);
    if (!responseFromCloudinary.url) {
      return res
        .status(500)
        .send({ error: "Failed to upload image to Cloudinary." });
    }
    fs.unlinkSync(req.file.path); // Remove file after uploading

    // Hash the password using bcrypt
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 5, (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve(hash);
        }
      });
    });

    // Create a verification token
    const verificationToken = JWT.sign({ email }, "GmailVerify", {
      expiresIn: "1h",
    });

    // Create and save the reader
    const reader = new ReaderModel({
      name,
      email,
      password: hash,
      contact,
      profileImg: responseFromCloudinary.url,
    });

    await reader.save();

    // Send verification email
    sendVerificationEmail(reader, verificationToken);
    res.status(200).send({ success: "Reader successfully added! Please check your email to verify your account." });
  } catch (error) {
    // Send only one response
    if (!res.headersSent) {
      res.status(500).send({ error: `Server Error`, details: error });
    }
  }
};

// Reader email verification
const emailVerify = async (req, res) => {
  const { token } = req.params;
  console.log("coming here veri");

  try {
    const decoded = JWT.verify(token, "GmailVerify");
    const pendingReader = await ReaderModel.findOne({ email: decoded.email });

    if (!pendingReader) {
      return res.status(400).send({ error: "Pending reader not found." });
    }

    const reader = new ReaderModel({
      name: pendingReader.name,
      email: pendingReader.email,
      password: pendingReader.password,
      contact: pendingReader.contact,
      profileImg: pendingReader.profileImg,
      isVerified: true,
    });

    await reader.save();
    await ReaderModel.deleteOne({ email: decoded.email });
    res
      .status(200)
      .send({
        message: "Email verified and reader account activated successfully.",
      });
  } catch (error) {
    res.status(400).send({ error: "Invalid or expired token." });
  }
};

// Login Reader
const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Get reader email from db
    const reader = await ReaderModel.findOne({ email });


    // This code is for gmail verification before login 
    if (!reader.isVerified) {
      res
        .status(400)
        .send({ error: "Please varify your email first then come to login." });
    }

    // Compare password using bcrypt
    if (reader) {
      bcrypt.compare(password, reader.password, async (error, pass) => {
        if (pass) {
          const readerToken = JWT.sign({ text: "BookReader" }, "BookReader"); // readertoken created
          res.status(200).send({
            success: "Reader has successfully logged in!",
            readerToken,
            readerId: reader._id,
            profileImg: reader.profileImg,
            readerEmail: reader.email,
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
    res.status(500).send({ error: `Server Error ${error}`, details: error });
  }
};

// Get all readers
const getAllreaders = async (req, res) => {
  try {
    const readers = await ReaderModel.find();
    if (readers.length > 0) {
      res.status(200).send(readers);
    } else {
      res.status(400).send({ error: `No readers available at the moment.` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// Get reader by id
const getReaderById = async (req, res) => {
  try {
    const id = req.params.id;
    const reader = await ReaderModel.findById(id);
    if (reader) {
      res.status(200).send(reader);
    } else {
      res.status(400).send({ error: `No reader found with id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// Delete reader by id
const deleteReaderById = async (req, res) => {
  try {
    const id = req.params.id;
    const reader = await ReaderModel.findById(id);
    if (reader) {
      await ReaderModel.findOneAndDelete({ _id: id });
      res.status(200).send({ success: `Account deleted successfully.` });
    } else {
      res.status(400).send({ error: `Reader not fount with this id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// update reader by id
const updateReaderById = async (req, res) => {
  try {
    const id = req.params.id;
    const reader = await ReaderModel.findOne({ _id: id });
    if (reader) {
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

        await ReaderModel.findOneAndUpdate(
          { _id: id },
          { ...req.body, profileImg: responseFromCloudinary.url }
        );
        res.status(200).send({ success: `Details updated successfully.` });
      } else {
        await ReaderModel.findOneAndUpdate({ _id: id }, req.body);
        res.status(200).send({ success: `Details updated successfully.` });
      }
    } else {
      res.status(400).send({ error: `Reader not fount with this id "${id}".` });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

// Reader by email true/false
const readerByEmail = async (req, res) => {
  try {
    const email = req.params.emailId;
    const reader = await ReaderModel.find({ email: email });
    if (reader.length) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (error) {
    res.status(500).send({ error: `Server error ${error}`, details: error });
  }
};

module.exports = {
  addReader,
  emailVerify,
  getAllreaders,
  loginReader,
  getReaderById,
  deleteReaderById,
  updateReaderById,
  readerByEmail,
};

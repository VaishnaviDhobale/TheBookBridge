const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    contact: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    awards: {
      type: [String],
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const AuthorModel = mongoose.model("Author", authorSchema);

module.exports = {
  AuthorModel,
};

const mongoose = require("mongoose");

const readerSchema = new mongoose.Schema(
  {
    name: {
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

    isVerified : {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true }
);

const ReaderModel = mongoose.model("Reader", readerSchema);

module.exports = {
  ReaderModel,
};

const JWT = require("jsonwebtoken");

const readerAuth = (req, res, next) => {
  try {
    const readerToken = req.headers.readertoken; // It's a good practice to use lowercase header names

    if (readerToken) {
      JWT.verify(readerToken, "BookReader", (err, decoded) => {
        if (decoded) {
          next();
        } else {
          res.status(401).send({ error: `Access denied. Invalid authentication. ${err.message}` });
        }
      });
    } else {
      res.status(401).send({ error: "Please log in to perform this action." });
    }
  } catch (error) {
    res.status(500).send({ error: "An error occurred while processing the request. Please try again later.", details: error.message });
  }
};

module.exports = {
  readerAuth
};

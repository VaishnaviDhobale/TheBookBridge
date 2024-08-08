const JWT = require("jsonwebtoken");

const authorAuth = (req, res, next) => {
  try {
    const authorToken = req.headers.authortoken; // It's a good practice to use lowercase header names

    if (authorToken) {
      JWT.verify(authorToken, "BookAuthor", (err, decoded) => {
        if (decoded) {
          next();
        } else {
          res
            .status(401)
            .send({
              error: `Access denied. Invalid authentication.`,
              details: err.message,
            });
        }
      });
    } else {
      res.status(401).send({ error: "Please log in to perform this action." });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        error:
          "An error occurred while processing the request. Please try again later.",
        details: error.message,
      });
  }
};

module.exports = {
  authorAuth,
};

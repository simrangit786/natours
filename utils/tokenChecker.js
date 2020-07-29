let jwt = require("jsonwebtoken");
// const config = require('./config.js');

let checkToken = (req, res, next) => {
  let token = req.headers["authorization"]; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith("Bearer ")) {
      // Checks if it contains Bearer
      // Remove Bearer from string
      token = token.slice(7, token.length); //Separate Bearer and get token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      //Inser the token and verify it.
      if (err) {
        return res.json({
          status: false,
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: false,
      message: "Access denied! No token provided.",
    });
  }
};

require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.key);
    if (decoded) {
      next();
    } else {
      res.send({ msg: "Login First" });
    }
  } else {
    res.send({ msg: "Login First" });
  }
};

module.exports = {
  authenticate,
};

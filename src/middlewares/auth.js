const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  // Read the token from the req cookies
  // validate the token and get the user from it
  try {
    const { token } = req?.cookies;
    if (!token) {
      throw new Error("Invalid Token. Please log in.");
    }
    const decodedToken = await jwt.verify(token, "DevX@1234Pass");
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
};

module.exports = { userAuth };

// >> ep 6

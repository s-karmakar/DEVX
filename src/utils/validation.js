const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required.");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email address is required.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password.");
  }
};

const validateLoginData = (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("A valid email address is required.");
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
};

const express = require("express");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

// singUp logic
authRouter.post("/signUp", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    // Encrypt the password before saving to the database
    const saltRounds = 10;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //dynamic user
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword, // Store the hashed password
    });
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    console.error(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

//login logic
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    validateLoginData(email, password);
    // 1st step is to check whether the email with any user exists in the database or not, if not then we will throw an error
    // if the user present then we will get the user obj and then we will compare the password with the hashed password stored in the database using bcrypt.compare() method
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found with the provided email.");
    }
    // check if the provided password matches the hashed password in the database
    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      // get the JWT token
      const token = await user.getJWT();

      // add the JWT Token to cookie & send the response back to user
      res.cookie("token", token, { expiresIn: "7D" });
      res.send("Login successful!");
    } else {
      throw new Error("Invalid password.");
    }
  } catch (error) {
    res.clearCookie("token");
    res.status(400).send("Error logging in: " + error.message);
  }
});

//logout logic
authRouter.post("/logout", async (req, res) => {
  // res.clearCookie("token");
  // res.send("Logout successful!");
  //both are same way
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful!");
});

module.exports = authRouter;

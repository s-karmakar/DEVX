const express = require("express");
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const { connectDB } = require("./config/database"); // this will connect to the database
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

const app = express();
app.use(express.json()); // this middleware given by express will parse the incoming request body to JSON format
app.use(cookieParser()); // this middleware will parse the cookies from the incoming request

// singUp logic
app.post("/signUp", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

// profile logic : get all info about my profile
app.get("/getProfile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found with the provided token.");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error getting profile: " + error.message);
  }
});

// sendConnect API to send connection request to another user
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("sending connection request from user:", user.email);
    res.send(user.firstName + ", Connection request sent successfully!");
  } catch (error) {
    res.status(400).send("Error sending connection request: " + error.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
});

// this is creating an instance of express server and listening to port: 7777

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(7777, () => {
      console.log("Server is running port 7777");
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

/**
 * by default whenever we hit any URL in the browser it will be a GET request, if we want to make a POST request we can use postman or any other tool to make a POST request
 */

const express = require("express");
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const { connectDB } = require("./config/database"); // this will connect to the database
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      // create a JWT token
      const token = jwt.sign({ _id: user._id }, "DevX@1234Pass");

      // add the JWT Token to cookie & send the response back to user
      res.cookie("token", token);
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
app.get("/getProfile", async (req, res) => {
  try {
    const { token } = req?.cookies;
    if (!token) {
      throw new Error("Invalid Credentials.");
    }
    // verify the token and get the user from it
    const decodedToken = await jwt.verify(token, "DevX@1234Pass");
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new Error("User not found with the provided token.");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error getting profile: " + error.message);
  }
});

// get all user from DB
app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching users " + error.message);
  }
});

//find user by email
app.get("/getUserByEmail", async (req, res) => {
  const userEmail = req.body.email;
  try {
    // const user = await User.findOne({ email: userEmail });
    const user = await User.find({ email: userEmail });
    if (!user || user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error fetching user " + error.message);
  }
});

// delete user by email
app.delete("/deleteUserByEmail", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const deletedUser = await User.deleteOne({ email: userEmail });
    if (!deletedUser.deletedCount) {
      console.log(deletedUser);
      return res.status(404).send("User not found to delete");
    }
    console.log(deletedUser);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting user " + error.message);
  }
});

// update user by email
app.patch("/updateUserByEmail/:email", async (req, res) => {
  const userEmail = req.params?.email;
  const updateData = req.body;

  // API Level Validation
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "about",
      "skills",
      "photoURL",
    ];
    const isUpdateAllowed = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdateAllowed) {
      throw new Error(
        "Invalid updates! Only firstName, lastName, password, age, about, skills, and photoURL can be updated.",
      );
    }

    if (updateData?.skills?.length > 10) {
      throw new Error("Skills  cannot have more than 10 items.");
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      updateData,
      { runValidators: true },
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).send("User not found to update");
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating user : " + error.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
});

// this is creating an instance of express server and listening to port 7777
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

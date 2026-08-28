const express = require("express");
const User = require("./models/user");
const { connectDB } = require("./config/database"); // this will connect to the database
const app = express();

app.use(express.json()); // this middleware given by express will parse the incoming request body to JSON format

// singUp logic
app.post("/signUp", async (req, res) => {
  // Handle sign-up logic here
  // const userOBJ = {
  //   firstName: "subhankar",
  //   lastName: "karmakar",
  //   email: "subhankar@example.com",
  //   password: "password123",
  // };
  //const user = new User(userOBJ);

  // static user
  // const user = new User({
  //   firstName: "sharukh",
  //   lastName: "paras",
  //   email: "sharukhß@tendulkar.com",
  //   password: "password123",
  // });

  //dynamic user
  const user = new User(req.body);
  console.log("user is getting created", user);
  try {
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user " + error.message);
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

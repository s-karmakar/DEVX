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
app.patch("/updateUserByEmail", async (req, res) => {
  const userEmail = req.body.email;
  const updateData = req.body;
  try {
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
    res.status(400).send("Error updating user " + error.message);
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

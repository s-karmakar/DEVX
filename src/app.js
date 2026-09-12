const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

// this middleware given by express will parse the incoming request body to JSON format
app.use(express.json());
// this middleware will parse the cookies from the incoming request
app.use(cookieParser());

const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const authRouter = require("./routes/authentication");
const userRouter = require("./routes/user");

app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", authRouter);
app.use("/", userRouter);

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

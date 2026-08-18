const express = require("express");
const app = express();


app.get("/user",(req,res)=> {
  // get call to DB to fetch user

  // getting query params from the URL
  console.log("user ID is ", req.query);
  res.send({"firstName": "Subhankar", "lastName": "Karmakar" });

});


// Dynamic Routes
app.get("/user/:userID/:userName/:city",(req,res)=> {
  // get call to DB to fetch user
  console.log("data is ", req.params);
  res.send({"userID": req.params.userID, "userName": req.params.userName, "city": req.params.city});

});

app.post("/user", (req, res) => {
  // post call to DB to create user

  // saving data to DB
  res.send("Data created successfully");
});


app.delete("/user", (req, res) => {
  // delete call to DB to delete user

  // saving data to DB
  res.send("Data deleted successfully");
});


// this fn is known as middleware as well Request Handeler  ROUTE HANDLER
// the sequence of the Rout handlers is important as the first matching route will be executed and the rest will be ignored
app.use("/", (req, res) => {
  res.send("Hello from express server");
});


// this is creating an instance of express server and listening to port 7777
app.listen(7777, () => {
  console.log("Server is running port 7777");
});


/**
 * by default whenever we hit any URL in the browser it will be a GET request, if we want to make a POST request we can use postman or any other tool to make a POST request
 */
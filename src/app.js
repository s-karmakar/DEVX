const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Namste NodeJS");
});

app.get("/about", (req, res) => {
  res.send("This is the about page");
});

app.listen(3000, () => {
  console.log("Server is running port 3000");
});

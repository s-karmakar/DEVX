const express = require("express");
const connectionRequestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth.js");

// sendConnect API to send connection request to another user
connectionRequestRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      console.log("sending connection request from user:", user.email);
      res.send(user.firstName + ", Connection request sent successfully!");
    } catch (error) {
      res
        .status(400)
        .send("Error sending connection request: " + error.message);
    }
  },
);

module.exports = connectionRequestRouter;

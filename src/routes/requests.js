const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

// sending connection request to other user
requestRouter.post(
  "/request/send/:status/:userID",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserID = req.params.userID;
      const fromUserID = req.user._id;
      /**
       * API Level Validation
       * 1. Check if the status is valid or not
       * 2. Check if the user is trying to send request to himself or not
       * 3. Check if the user is already connected with the other user or not
       * 4. Check if the user has already sent a request to the other user or not
       * 5. Check if the user has already received a request from the other user or not
       * 6. Check if the user is trying to send a request to a valid user or not  
       */

      // status validation
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      // toUser Validation
      // if (typeof toUserID !== mongoose.Schema.Types.ObjectId) {
      //   throw new Error("Invalid UserID format");
      // }
      const toUser = await User.findById(toUserID);
      if (!toUser) {
        throw new Error("User not found with ID: " + toUserID);
      }

      // already exist same connect request between users
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserID: fromUserID, toUserID: toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });
      if (existingRequest) {
        throw new Error("Connection request already exists between users");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserID,
        toUserID,
        status,
      });
      const data = await connectionRequest.save();

      res.status(201).json({
        message: `${req.user.firstName}  ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

// reviewing connection request from other user
requestRouter.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res) => {
    try {
      // validate the status
      // validate the requestID
      // toUserID should be logged in user

      const loggedInUser = req.user;
      const { status, requestID } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      if (!mongoose.Types.ObjectId.isValid(requestID)) {
        throw new Error("Invalid requestID format");
      }

      //connection request validation
      const connectionRquest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserID: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRquest) {
        throw new Error("No  pending connection request found");
      }

      connectionRquest.status = status;
      const data = await connectionRquest.save();
      res.status(200).json({
        message: `Connection request ${status} successfully`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

module.exports = requestRouter;

const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoURL",
  "age",
  "gender",
  "about",
  "skills",
];

// get all the pending user requests for the logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    console.log("req.user", req.user);
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserID: loggedInUser._id,
      status: "interested",
    }).populate("fromUserID", USER_SAFE_DATA); // populate the fromUserID field with name, email, and profileImage
    // // }).populate("fromUserID", "firstName lastName email photoURL age gender about skills");

    res.status(200).json({
      message: "Pending Requests Fetched Successfully",
      data: pendingRequests,
    });
  } catch (error) {
    res.status(500).json({ "Error Fetching Pending Requests": error.message });
  }
});

// get all the connections for logged in user connection request => accepted
userRouter.get("/user/request/myConnections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserID: loggedInUser._id, status: "accepted" },
        { toUserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserID", USER_SAFE_DATA)
      .populate("toUserID", USER_SAFE_DATA);

    if (!connections) {
      throw new Error("No Connections Found");
    }

    // filter the connections to get only the other user in the connection
    const myConnections = connections.map((element) => {
      if (element.fromUserID._id.equals(loggedInUser._id)) {
        return element.toUserID;
      } else {
        return element.fromUserID;
      }
    });

    res.status(200).json({
      message: "My Connections Fetched Successfully",
      data: myConnections,
    });
  } catch (error) {
    res.status(500).json({ "Error Fetching My Connections": error.message });
  }
});

module.exports = userRouter;

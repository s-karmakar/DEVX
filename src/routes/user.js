const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : 10;

    const skip = (page - 1) * limit;

    // get all the connection requests where the logged in user is either the fromUser or toUser
    const existingInterests = await ConnectionRequest.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    }).select("fromUserID toUserID");

    // creating a Delta set of user IDs that the logged-in user has already interacted with
    const hideUserIDs = new Set();
    existingInterests.forEach((element) => {
      hideUserIDs.add(element.fromUserID.toString());
      hideUserIDs.add(element.toUserID.toString());
    });

    // finalising the Feed
    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserIDs) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    if (!feed) {
      throw new error("feed data not found");
    }
    res.send({ data: feed });
  } catch (error) {
    res.status(500).json({ "Error Fetching Feed": error.message });
  }
});

module.exports = userRouter;

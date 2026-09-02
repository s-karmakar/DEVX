const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

// profile logic : get all info about my profile
profileRouter.get("/myProfile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found with the provided token.");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error getting profile: " + error.message);
  }
});

// profile edit logic : edit my profile
profileRouter.patch("/myProfile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid fields in the request body.");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });
    await loggedInUser.save();

    res.json({
      message: `Profile updated successfully for ${loggedInUser.firstName} ${loggedInUser.lastName}`,
      updatedProfile: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error editing profile: " + error.message);
  }
});

module.exports = profileRouter;

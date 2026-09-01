const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: { type: Number, age: 16 },
    gender: {
      type: String,
      //custom validation :  and by default it runs only at the time of user creation
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender must be either male, female, or other");
        }
      },
    },
    about: {
      type: String,
      default:
        "this is default about me section, please update it with your own information",
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for photo: " + value);
        }
      },
    },
  },
  {
    timestamps: true, // this will automatically add createdAt and updatedAt fields to the schema
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  // create a JWT token
  const token = await jwt.sign({ _id: user._id }, "DevX@1234Pass", {
    expiresIn: "7D",
  }); // token will expire in 7 days
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordEnteredByUser = password;
  const passwordHash = user.password; // hashed password stored in the database
  const isPasswordMatch = await bcrypt.compare(
    passwordEnteredByUser,
    user.password,
  );
  return isPasswordMatch;
};

// const User = mongoose.model("User", userSchema);
// module.exports = User;

module.exports = mongoose.model("User", userSchema);

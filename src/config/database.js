const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rohankarmakar3d_db_user:ZW07hlkzIktM9UFe@devxnode.h3ddkml.mongodb.net/DEVX",
  );
};

module.exports = { connectDB };

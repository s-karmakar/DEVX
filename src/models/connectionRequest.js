const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // reference to the User  Schema model
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User  Schema model
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// compound index
connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 }, { unique: true });

// pre-save hook to check if the fromUser & toUser is same

// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;

//   if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
//     throw new Error("Cannot send request to self");
//   }
//   next(); // ? getting error as next is not a fn multiple times
// });

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);

// const ConnectionRequest = mongoose.model(
//   "ConnectionRequest",
//   connectionRequestSchema,
// );

// module.exports = ConnectionRequest;

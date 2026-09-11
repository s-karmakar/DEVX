const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
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

// pre-save hook to check if the fromUser & toUser is same
// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;
//   if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
//     throw new Error("Cannot send request to self");
//   }

//   //to-do check if the tousserID is a valid mongoose id or not
//   return next();
// });

// const ConnectionRequest = mongoose.model(
//   "ConnectionRequest",
//   connectionRequestSchema,
// );

// module.exports = ConnectionRequest;

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);

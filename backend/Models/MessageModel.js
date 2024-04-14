const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageModel = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    Chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageModel);

module.exports = Message;

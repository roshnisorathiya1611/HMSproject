import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "HMSUsers",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: "HMSUsers",
    },
    combinedId: {
      type: String,
      required: true,
    },
    file: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HMSChats", ChatSchema);

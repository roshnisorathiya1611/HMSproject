import mongoose from "mongoose";

const SlotsSchema = new mongoose.Schema({
  openedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "HMSUsers",
    required: true,
  },
  bookedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "HMSUsers",
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false,
  },
  roomId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("HMSSlots", SlotsSchema);

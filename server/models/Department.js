import mongoose from "mongoose";

const DeparmentSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
});

export default mongoose.model("HMSDepartments", DeparmentSchema);

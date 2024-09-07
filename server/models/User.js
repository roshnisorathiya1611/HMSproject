import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "doctor",
    required: true,
  },
  deparmentId: {
    type: mongoose.Types.ObjectId,
    ref: "HMSDepartments",
    required: false,
  },
  profilePic: {
    type: String,
    required: true,
    default:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  phone: String,
  about: String,
  address: {
    state: String,
    street: String,
    city: String,
    zip: String,
  },
});

UserSchema.index({ name: "text", email: "text" });

export default mongoose.model("HMSUsers", UserSchema);

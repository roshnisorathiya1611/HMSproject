import User from "../models/User.js";
import Slots from "../models/Slots.js";
import { sendJsonResponse } from "../utils/general.js";
import { v4 as uuidv4 } from "uuid";
const fetchAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select(
      "name email profilePic about address"
    );
    return res.status(200).json({ success: true, patients });
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await User.find({
      role: "patient",
      $text: { $search: query },
    }).select("name email profilePic about address");
    return res.status(200).json({ success: true, patients });
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const openSlot = async (req, res) => {
  try {
    const { start, end } = req.body;
    // check if slot is already exist
    const oldSlot = await Slots.findOne({
      start: start,
      end: end,
      openedBy: req.user._id,
    });
    if (oldSlot) {
      return sendJsonResponse(400, false, "Slot already exist", res);
    }

    // generate the new roomId to join the video call
    let roomId = uuidv4();
    const newSlot = new Slots({
      start: start,
      end: end,
      openedBy: req.user._id,
      roomId: roomId,
    });
    await newSlot.save();
    return sendJsonResponse(200, true, "Slot created successfully", res);
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const getAllSlots = async (req, res) => {
  const slots = await Slots.find({
    openedBy: req.user._id,
  }).populate("bookedBy", "name email profilePic _id");
  return res.status(200).json({ success: true, slots });
};

const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Slots.findOneAndDelete({
      _id: id,
      openedBy: req.user._id,
      isBooked: false,
    });
    if (!response) {
      return sendJsonResponse(400, false, "Cannot Delete the slot", res);
    }
    return sendJsonResponse(200, true, "Slot deleted", res);
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

export { fetchAllPatients, searchPatients, openSlot, getAllSlots, deleteSlot };

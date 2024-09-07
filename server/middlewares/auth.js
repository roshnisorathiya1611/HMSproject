import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const validateBodyData = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  res.status(400).json({ success: false, message: result.array()[0]["msg"] });
};

// Check: Authentication
const isLoggedIn = (req, res, next) => {
  console.log("Is logged in is getting called ");
  try {
    const token = req.headers["authorization"];
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    // inject user if from the token into request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

// Authorisations
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user && user.role == "admin") {
    return next();
  }
  return res
    .status(401)
    .json({ success: false, message: "Only admins have access to this route" });
};

const isDoctor = async (req, res, next) => {
  console.log("is Docket is getting called");
  const user = await User.findById(req.user._id);
  if (user && user.role == "doctor") {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Only Doctors have access to this route",
  });
};

const isPatient = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user && user.role == "patient") {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Only Patients have access to this route",
  });
};

export { validateBodyData, isLoggedIn, isAdmin, isDoctor, isPatient };

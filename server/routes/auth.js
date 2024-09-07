import express from "express";
const router = express.Router();
import { body } from "express-validator";

// controllers
import {
  signup,
  login,
  changePassword,
  updateDetails,
  uploadImage,
  getUserDetails,
} from "../controllers/auth.js";
import { fetchAllMessages } from "../controllers/chat.js";
// middlewares
import { isLoggedIn, validateBodyData } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

router.post(
  "/signup",
  body("name")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Name must be altlest 3 chars"),
  body("email").exists().isEmail().withMessage("Invalid Email"),
  body("password").exists().isStrongPassword().withMessage("Password is Weak"),
  body("gender")
    .exists()
    .isIn(["male", "female", "others"])
    .withMessage("Provide the correct Gender"),
  validateBodyData,
  signup
);

router.post("/login", login);

router.put(
  "/password",
  body("currentPassword").exists().withMessage("Current Password is required"),
  body("newPassword")
    .exists()
    .isStrongPassword()
    .withMessage("New Password is required"),
  validateBodyData,
  isLoggedIn,
  changePassword
);

router.post(
  "/profile-photo",
  isLoggedIn,
  upload.single("profilepic"),
  uploadImage
);

router.put("/profile", isLoggedIn, updateDetails);

router.get("/details", isLoggedIn, getUserDetails);

router.post("/messages", isLoggedIn, fetchAllMessages);
export default router;

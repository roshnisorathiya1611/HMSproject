import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendJsonResponse } from "../utils/general.js";
const signup = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    // check if email already exist or not
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return sendJsonResponse(400, false, "Email already in use", res);
    }

    // hash password
    bcrypt.hash(password, 10, async function (err, hash) {
      // create a new account
      const newUser = new User({
        email,
        password: hash,
        gender,
        name,
      });
      await newUser.save();

      return sendJsonResponse(200, true, "Acount Created", res);
    });
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const login = async (req, res) => {
  console.log("Login");
  try {
    const { email, password } = req.body;

    // check if email is correct or not
    const user = await User.findOne({ email });
    if (!user) {
      return sendJsonResponse(400, false, "Invalid Email", res);
    }
    // compare password
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) return sendJsonResponse(400, false, "Invalid Password", res);
      else {
        // Sign the Token and give it back to user
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        const newUserResponse = {
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          phone: user?.phone || "",
          about: user?.about || "",
          street: user?.address?.street || "",
          city: user?.address?.city || "",
          state: user?.address?.state || "",
          zip: user?.address?.zip || "",
          token: token,
          role: user.role,
          _id: user._id,
        };
        return res.status(200).json({ success: true, user: newUserResponse });
      }
    });
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // I will find your acocunt
    const userId = req.user._id;
    const userAccount = await User.findById(userId);
    if (!userAccount)
      return sendJsonResponse(400, false, "No details found in db", res);
    // validate the current Password
    bcrypt.compare(
      currentPassword,
      userAccount.password,
      function (err, result) {
        if (!result)
          return sendJsonResponse(400, false, "Invalid Password", res);
        else {
          // Upate your password
          bcrypt.hash(newPassword, 10, async function (err, hash) {
            // create account
            userAccount.password = hash;
            await userAccount.save();
            return sendJsonResponse(200, true, "Password Updated Created", res);
          });
        }
      }
    );
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const updateDetails = async (req, res) => {
  try {
    const { phone, about, street, city, state, zip } = req.body;
    //  I will find your acocunt
    const userId = req.user._id;
    const userAccount = await User.findById(userId);
    if (!userAccount)
      return sendJsonResponse(400, false, "No details found in db", res);

    // update details
    userAccount.phone = phone;
    userAccount.about = about;
    userAccount.address = {
      state: state,
      street: street,
      city: city,
      zip: zip,
    };
    await userAccount.save();
    return sendJsonResponse(200, true, "Details Updated", res);
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};

const uploadImage = async (req, res) => {
  console.log("update file route hit");
  // if file is uploaded or not
  if (req.file && req.file.location) {
    // take the id
    const userId = req.user._id;
    const userAccount = await User.findById(userId);

    userAccount.profilePic = req.file.location;
    await userAccount.save();
    return sendJsonResponse(200, true, "Profile photo updated", res);
  } else {
    return sendJsonResponse(500, false, "No file found", res);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const newUserResponse = {
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      phone: user?.phone || "",
      about: user?.about || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zip: user?.address?.zip || "",
    };
    return res.status(200).json({ success: true, user: newUserResponse });
  } catch (err) {
    return sendJsonResponse(500, false, "No file found", res);
  }
};
export {
  signup,
  login,
  changePassword,
  updateDetails,
  uploadImage,
  getUserDetails,
};

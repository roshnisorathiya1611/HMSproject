import User from "../models/User.js";
import Department from "../models/Department.js";
import { v4 as uuidv4 } from "uuid";
import { sendJsonResponse } from "../utils/general.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Slots from "../models/Slots.js";
const createDoctorAccount = async (req, res) => {
  try {
    const { name, email, gender, department_id } = req.body;

    // check if email already exist or not
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return sendJsonResponse(400, false, "Email already in use", res);
    }

    // check if the department id is valid or not
    const department = await Department.findById(department_id);
    if (!department) {
      return sendJsonResponse(400, false, "Department Id is Wrong!", res);
    }

    // autgenerate a password
    let password = uuidv4();

    // hash password
    bcrypt.hash(password, 10, async function (err, hash) {
      // create a new account
      const newUser = new User({
        email,
        password: hash,
        gender,
        name,
        emailVerified: true,
        deparmentId: department_id,
        role: "doctor",
      });
      await newUser.save();

      // send email to doctor about his login id and password
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "a.m2001nov@gmail.com",
          pass: process.env.EMAIL_PASS,
        },
      });

      var mailOptions = {
        from: "a.m2001nov@gmail.com",
        to: email,
        subject: "Welcom to HIS!. Doctor account is created for you.",
        text: `Hi ${name}, a new doctor account is created for you by the admin\n. User
        the following credentials to login\n
        Email: ${email}\n
        Password: ${password}\n
        
        You can change the password after login!\n
        Thanks!`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return sendJsonResponse(200, true, "Acount Created Successfully", res);
    });
  } catch (err) {
    return sendJsonResponse(500, false, err.message, res);
  }
};
const createDepartment = async (req, res) => {
  const { name } = req.body;
  const old = await Department.findOne({ name: name });
  if (old) {
    return sendJsonResponse(400, false, "Department already exist", res);
  }

  const newdp = new Department({
    name: name,
  });
  await newdp.save();
  return res
    .status(200)
    .json({ success: true, message: "department created", newdp });
};

const getAllDepartments = async (req, res) => {
  let departments = await Department.find();
  return res.status(200).json({ success: true, departments });
};

const getAllDoctors = async (req, res) => {
  let doctors = await User.find({ role: "doctor" }).populate("deparmentId");
  return res.status(200).json({ success: true, doctors });
};

const resetPassword = async (req, res) => {
  const { accountId } = req.body;

  const account = await User.findById(accountId);
  if (!account) {
    return sendJsonResponse(400, false, "Account Id is invalid!", res);
  }

  // autogenerate a password
  let password = uuidv4();

  bcrypt.hash(password, 10, async function (err, hash) {
    // Updating account
    account.password = hash;
    await account.save();

    // send email to doctor about his login id and password
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "a.m2001nov@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: "a.m2001nov@gmail.com",
      to: account.email,
      subject: "Your account password is reset by the Admin!.",
      text: `Hi ${account.name}, your account password is reset by the admin.\n. Use
      the following new credentials to login\n
      Email: ${account.email}\n
      Password: ${password}\n
      
      You can change the password after login!\n
      Thanks!`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return sendJsonResponse(200, true, "Password Reset Successfully", res);
  });
};

const doctorsInEachDepartment = async (req, res) => {
  let stats = await User.aggregate([
    {
      $match: { role: "doctor" },
    },
    {
      $group: {
        _id: "$deparmentId",
        userCount: { $count: {} },
      },
    },
  ]);
  let allDepartmens = await Department.find();

  // Arrays to be sent to frontend code
  let deparments = [];
  let counts = [];

  // Go for each depatment
  for (let department of allDepartmens) {
    deparments.push(department.name);
    // try to find the count in stats for this id
    for (let item of stats) {
      if (item._id.toString() == department._id.toString()) {
        counts.push(item.userCount);
        break;
      }
    }
  }

  return res.status(200).json({ success: true, deparments, counts });
};

const bookingsInEachDepartment = async (req, res) => {
  //  Fetch all the slots
  const slots = await Slots.find({ isBooked: true }).populate("openedBy");

  // this object will store departmentId is count
  let obj = {};

  for (let slot of slots) {
    let depId = slot.openedBy.deparmentId.toString();
    if (!obj.hasOwnProperty(depId)) {
      obj[depId] = 1;
    } else {
      obj[depId] += 1;
    }
  }

  // Fetch All the departmens
  let allDepartmens = await Department.find();

  // Arrays to be sent to frontend
  let deparments = [];
  let counts = [];

  // Go for each depatment
  for (let department of allDepartmens) {
    deparments.push(department.name);
    if (obj[department._id]) counts.push(obj[department._id]);
    else counts.push(0);
  }

  return res.status(200).json({ success: true, deparments, counts });
};
export {
  createDoctorAccount,
  createDepartment,
  getAllDepartments,
  getAllDoctors,
  resetPassword,
  doctorsInEachDepartment,
  bookingsInEachDepartment,
};

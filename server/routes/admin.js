import express from "express";
const router = express.Router();

// controllers
import {
  createDepartment,
  createDoctorAccount,
  getAllDepartments,
  getAllDoctors,
  resetPassword,
  doctorsInEachDepartment,
  bookingsInEachDepartment,
} from "../controllers/admin.js";

router.post("/create-doctor", createDoctorAccount);
router.post("/create-department", createDepartment);
router.get("/departments", getAllDepartments);
router.get("/doctors", getAllDoctors);
router.post("/reset-password", resetPassword);
router.get("/doctors-in-department", doctorsInEachDepartment);
router.get("/bookings-in-department", bookingsInEachDepartment);
export default router;

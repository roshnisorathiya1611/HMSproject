import express from "express";
const router = express.Router();

// This is the patient controllers
import {
  fetchAllDoctors,
  fetchAllDepartments,
  filterDoctorsByDeparmentOrName,
  giveSlotsOfaDoctor,
  bookSlot,
  getAllAppointments,
} from "../controllers/patient.js";

router.get("/all-doctors", fetchAllDoctors);
router.get("/all-departments", fetchAllDepartments);
router.get("/filter-doctors", filterDoctorsByDeparmentOrName);
router.get("/doctor-slots/:doctorId", giveSlotsOfaDoctor);
router.put("/book-slot/:slotId", bookSlot);
router.get("/all-slots", getAllAppointments);
export default router;

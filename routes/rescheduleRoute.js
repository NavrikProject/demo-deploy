import express from "express";
import { rescheduleBookingAppointment } from "../controllers/rescheduleController.js";
let router = express.Router();

router.get("/", rescheduleBookingAppointment);

export default router;

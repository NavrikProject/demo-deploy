import routers from "express";
import {
  getAllAttendedSessions,
  getAllCompletedSessions,
  getAllMentorBookings,
  getAllNotAttendedSessions,
  getAllRefundedSessions,
  getAllUpcomingSessions,
  getBookingDatesOfOnlyMentor,
  getMentorAvailability,
  issueRefundForBooking,
  modifyAppointmentAndMakePayment,
  modifyBookingDate,
  modifyCreateOrder,
  rescheduleBookingDate,
  updateAttendedSessions,
} from "../controllers/traineeBookingProfileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

let router = routers.Router();

router.post("/get/bookings", getAllMentorBookings);

router.post("/get/bookings/onlymentor", getBookingDatesOfOnlyMentor);

router.post("/get/bookings/availability", getMentorAvailability);

router.put("/update/bookings/:id", modifyBookingDate);

router.put("/reschedule/bookings/:id", rescheduleBookingDate);

router.post("/update/bookings/modify-order", modifyCreateOrder);

router.put(
  "/update/bookings/modify-booking/pay",
  modifyAppointmentAndMakePayment
);

router.post("/get/bookings/upcoming", getAllUpcomingSessions);
router.post(
  "/get/bookings/attended/update",
  verifyToken,
  updateAttendedSessions
);
router.post("/get/bookings/attended", getAllAttendedSessions);
router.post("/get/bookings/completed", getAllCompletedSessions);
router.post("/get/bookings/refunded", getAllRefundedSessions);
router.post("/get/bookings/not-attended", getAllNotAttendedSessions);

router.post("/update/bookings/issue-refund", issueRefundForBooking);

export default router;

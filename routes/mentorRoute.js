import routers from "express";
import {
  registerMentor,
  getAllMentorDetails,
  updateMentorApprove,
  updateMentorDisapprove,
  getAllMentorApprovedDetails,
  getMentorBySearch,
  createMentorAppointment,
  getAllMentorApprovedDetailsAndAvailability,
  getBookingDates,
  createMentorRazorPayOrder,
  getIndividualMentorDetails,
} from "../controllers/mentorController.js";
import { verifyTokenAndAuthorization } from "../middleware/verifyToken.js";
let router = routers.Router();

//to register for a new mentor route
router.post("/register/apply-now", registerMentor);

// to get all the mentors in dashboard
router.get("/get", verifyTokenAndAuthorization, getAllMentorDetails);

// get only approved mentor to show in website
router.get("/get/all", getAllMentorApprovedDetails);

router.get("get/available", getAllMentorApprovedDetailsAndAvailability);

//update the mentor to approve
router.put("/approve/:id", verifyTokenAndAuthorization, updateMentorApprove);

//update the mentor to disapprove
router.put(
  "/disapprove/:id",
  verifyTokenAndAuthorization,
  updateMentorDisapprove
);

// searching the mentor
router.get("/get/mentors", getMentorBySearch);

// get all mentor individual mentor details
router.get("/get/individual/mentors", getIndividualMentorDetails);

// to book the appointment with mentor and make payment
router.post("/create/appointment/pay-order", createMentorAppointment);

//creating the razorpay order for the mentor appointment
router.post("/create/appointment/create-order", createMentorRazorPayOrder);

// to get only appointment dates in booking table
router.get("/get/booking", getBookingDates);

export default router;

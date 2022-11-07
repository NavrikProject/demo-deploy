import express from "express";
import {
  bookInstructorLiveClass,
  getAllBookingLiveClasses,
  getAllTraineeCompleteCourses,
  getTraineeCompletedLiveClassDetailsInAdmin,
  getTraineeInCompleteCourses,
  getTraineeLiveClassDetailsInAdmin,
} from "../../controllers/AdminTraineeCourseControllers/AdminTraineeCourseControllers.js";
let router = express.Router();

router.get("/get/in-complete-courses", getTraineeInCompleteCourses);
router.post("/post/instructor-class", bookInstructorLiveClass);
router.get("/get/all/instructor-class", getAllBookingLiveClasses);
router.post(
  "/get/individual/instructor-class",
  getTraineeLiveClassDetailsInAdmin
);
router.get("/get/all/completed-courses", getAllTraineeCompleteCourses);
router.post(
  "/get/all/live-completed-classes",
  getTraineeCompletedLiveClassDetailsInAdmin
);
export default router;

import routers from "express";
import {
  getTraineeCompleteCourses,
  getTraineeInCompleteCourses,
  getTraineeLiveAttendedLiveClassDetails,
  getTraineeLiveClassDetails,
  insertTraineeCourseFeedBackController,
} from "../../controllers/traineeControllers/traineeCourseProgressControllers.js";

let router = routers.Router();

router.post("/get-trainee-incomplete-course", getTraineeInCompleteCourses);
router.post("/get-trainee-complete-course", getTraineeCompleteCourses);
router.post("/get-trainee-live-classes", getTraineeLiveClassDetails);
router.post("/course/feedback", insertTraineeCourseFeedBackController);
router.post(
  "/get-trainee-live-attended-classes",
  getTraineeLiveAttendedLiveClassDetails
);

export default router;

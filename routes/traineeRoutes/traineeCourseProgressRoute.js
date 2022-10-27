import routers from "express";
import {
  getTraineeCompleteCourses,
  getTraineeInCompleteCourses,
} from "../../controllers/traineeControllers/traineeCourseProgressControllers.js";

let router = routers.Router();

router.post("/get-trainee-incomplete-course", getTraineeInCompleteCourses);
router.post("/get-trainee-complete-course", getTraineeCompleteCourses);

export default router;

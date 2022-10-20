import routers from "express";
import {
  addTraineeCourseDetails,
  getAllTraineeProgress,
  getCoursesByCategory,
  getTraineeCourseStatus,
  updateTraineeCourseProgress,
  updateTraineeCourseVideoUpload,
} from "../controllers/traineeCourseController.js";
let router = routers.Router();

import { verifyTokenAndAuthorization } from "../middleware/verifyToken.js";

//add trainee course detailsFlex
router.post("/add-trainee-course/:id", addTraineeCourseDetails);
router.get("/get-all-trainee-courses", getAllTraineeProgress);
router.get("/get-courses-by-category/master", getCoursesByCategory);
router.put("/update-course-progress/:id", updateTraineeCourseProgress);
router.get("/trainee/course-status/:id", getTraineeCourseStatus);
router.put("/update-video-upload/:id", updateTraineeCourseVideoUpload);

export default router;

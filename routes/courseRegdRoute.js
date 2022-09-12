import {
  createNewCourse,
  getAllTheCourses,
  editCourse,
  deleteCourse,
} from "../controllers/courseNewController.js";
import { verifyTokenAndAuthorization } from "../middleware/verifyToken.js";

import routers from "express";
let router = routers.Router();

// adding new course route
router.post("/add/:id", verifyTokenAndAuthorization, createNewCourse);
// getting the all the courses in dashboard
router.get("/dashboard/courses", verifyTokenAndAuthorization, getAllTheCourses);
// edit specific course
router.put("/edit/:id", verifyTokenAndAuthorization, editCourse);
// delete specific course
router.delete("/delete/:id", verifyTokenAndAuthorization, deleteCourse);

export default router;

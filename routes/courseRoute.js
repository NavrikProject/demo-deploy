import {
  getCourseController,
  allCourseControllers,
  getCourseByCategoryDomain,
  getCourseByCategorySoftware,
  getCourseByCategoryItSkills,
  getCourseBySearch,
  getMasterCourseByTitles,
  addJoinNowCourse,
  getCourseBySearchInAllCourses,
  getCourseByCategory,
} from "../controllers/courseControllers.js";

import { verifyToken } from "../middleware/verifyToken.js";
import routers from "express";

let router = routers.Router();

// specific  course
router.get("/full-course/:id", getCourseController);

// get course by name
router.get("/all-courses", allCourseControllers);
//get course by search
router.get("/search", getCourseBySearch);

router.get("/category/domain", getCourseByCategoryDomain);
router.get("/category/it-skills", getCourseByCategoryItSkills);
router.get("/category/software", getCourseByCategorySoftware);

//get master course in join now form
router.get("/master", getMasterCourseByTitles);

// get course by category in the all courses section
router.get("/find", getCourseByCategory);
// get course by search term
router.get("/find", getCourseBySearchInAllCourses);
// join now form submission
router.post("/joinNow", verifyToken, addJoinNowCourse);

export default router;

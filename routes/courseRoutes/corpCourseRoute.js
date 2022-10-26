import routers from "express";
import { corpCourseControllers } from "../../controllers/courseControllers/corpCourseController.js";
let router = routers.Router();

router.get("/all-courses", corpCourseControllers);

export default router;

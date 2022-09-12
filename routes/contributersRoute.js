import routers from "express";
import {
  getAddContentCourseList,
  getAllContributerForChanges,
  getRemoveContentCourseList,
  getSuggestContentCourseList,
  loginContributer,
  registerForContributer,
  requestForContributerCourses,
  updateContributerApprove,
} from "../controllers/contributerController.js";
import { verifyTokenAndAuthorization } from "../middleware/verifyToken.js";
let router = routers.Router();

router.post("/register", registerForContributer);
router.post("/login", loginContributer);
router.post("/request-contribution", requestForContributerCourses);
router.get("/get-all", getAllContributerForChanges);
router.post("/add-content", getAddContentCourseList);
router.post("/suggest-content", getSuggestContentCourseList);
router.post("/remove-content", getRemoveContentCourseList);
//update the mentor to approve
router.put(
  "/approve/:id",
  verifyTokenAndAuthorization,
  updateContributerApprove
);
export default router;

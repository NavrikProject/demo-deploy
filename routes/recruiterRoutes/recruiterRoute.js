import {
  addHiringCompanyDetails,
  createJobPost,
  getAllClosedJobDetails,
  getAllOpenJobDetails,
  getFirmAllDetails,
  updateJobPostToClosedState,
} from "../../controllers/recruiterControllers/recruiterController.js";
import routers from "express";
let router = routers.Router();

router.post("/add-company-details", addHiringCompanyDetails);

router.get("/get-company-details/:id", getFirmAllDetails);

router.post("/create-job-post/:id", createJobPost);
router.get("/get/closed-positions", getAllClosedJobDetails);
router.get("/get/open-positions", getAllOpenJobDetails);
router.put("/update/to-closed-position/:id", updateJobPostToClosedState);
export default router;

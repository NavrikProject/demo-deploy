import routers from "express";
import {
  getAllActiveJobDetailsInAdmin,
  getAllInActiveJobDetailsInAdmin,
  getAllJobDetails,
  getIndividualJobDetails,
  updateJobPostToActiveState,
  updateJobPostToInActiveState,
  getJobBySearch,
} from "../../controllers/jobControllers/jobsController.js";
let router = routers.Router();

router.get("/get/all-jobs-posts", getAllJobDetails);
router.get("/get/individual-job-post/:id", getIndividualJobDetails);
router.get("/get/search", getJobBySearch);
router.get("/get/active-jobs-posts", getAllActiveJobDetailsInAdmin);
router.get("/get/inactive-jobs-posts", getAllInActiveJobDetailsInAdmin);
router.put("/put/job-posts/active-status/:id", updateJobPostToActiveState);
router.put("/put/job-posts/inactive-status/:id", updateJobPostToInActiveState);

export default router;

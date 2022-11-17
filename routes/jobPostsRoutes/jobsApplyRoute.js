import express from "express";
import {
  applyForJobPost,
  applyJobWithExpDetails,
  applyJobWithUpdateJobPost,
  checkJobSeekerDetails,
  getAllViewResponseForJobPost,
  getJobAppliedStatus,
} from "../../controllers/jobControllers/jobsApplyController.js";

let router = express.Router();
// apply for a job route
router.post("/post/:id", applyForJobPost);
router.post("/post/experience/:id", applyJobWithExpDetails);
router.post("/post/update/:id", applyJobWithUpdateJobPost);
router.get("/post/view-responses/:id", getAllViewResponseForJobPost);
router.post("/post/applied-status/:id", getJobAppliedStatus);
router.get("/post/form-status/:id", checkJobSeekerDetails);

export default router;

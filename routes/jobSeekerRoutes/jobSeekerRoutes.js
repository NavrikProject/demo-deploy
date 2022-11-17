import express from "express";
import { getAllAppliedJobByUser } from "../../controllers/jobSeekerControllers/jobSeekerController.js";

let router = express.Router();
router.post("/view-jobs/:id", getAllAppliedJobByUser);
export default router;

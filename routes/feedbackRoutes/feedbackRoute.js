import express from "express";
import {
  getFeedbackByMentorName,
  getFeedbackMentorController,
  getRewardPointsForUsers,
  insertContactUsDetails,
  insertFeedBackController,
  uploadImage,
} from "../../controllers/feedbackControllers/feedbackController.js";
let router = express.Router();

router.post("/", insertFeedBackController);
router.post("/get/mentor-feedback", getFeedbackMentorController);
router.get("/get/mentor-feedback/mentors", getFeedbackByMentorName);
router.post("/contact-us", insertContactUsDetails);
router.post("/upload", uploadImage);
router.get("/reward-points/:id", getRewardPointsForUsers);
export default router;

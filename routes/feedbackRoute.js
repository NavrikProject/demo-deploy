import express from "express";
import {
  getFeedbackByMentorName,
  getFeedbackMentorController,
  insertContactUsDetails,
  insertFeedBackController,
  uploadImage,
} from "../controllers/feedbackController.js";
let router = express.Router();

router.post("/", insertFeedBackController);
router.post("/get/mentor-feedback", getFeedbackMentorController);
router.get("/get/mentor-feedback/mentors", getFeedbackByMentorName);
router.post("/contact-us", insertContactUsDetails);
router.post("/upload", uploadImage);
export default router;

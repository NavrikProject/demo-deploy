import express from "express";
import { updateMentorProfileImage } from "../../controllers/mentorControllers/mentorProfileController.js";

let router = express.Router();

router.put("/image/update/:id", updateMentorProfileImage);
export default router;

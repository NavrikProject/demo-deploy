import express from "express";
import {
  fillAdditionalMentorDetails,
  registerAMentorFirstTime,
} from "../../controllers/mentorControllers/mentorRegistrationController.js";

let router = express.Router();

router.post("/basic-details", registerAMentorFirstTime);
router.post("/fill/additional-details", fillAdditionalMentorDetails);
export default router;

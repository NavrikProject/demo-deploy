import routers from "express";
let router = routers.Router();
import {
  updateTrainerProfileDetailsController,
  getTrainerProfileDetailsController,
  updateTrainerUserAccountCtrl,
  updateTrainerProfilePicture,
  updateTechnicalDetails,
  getOnlyTrainerCourses,
  addBankAccountDetails,
  getTrainerProfileDetailsInSinglePage,
} from "../controllers/trainerProfileController.js";

import { verifyToken } from "../middleware/verifyToken.js";

// post details to trainer profile table
router.post("/new/add/:id", verifyToken, updateTrainerProfileDetailsController);

// get data from the trainer profile table
router.get("/new/get/:id", verifyToken, getTrainerProfileDetailsController);

//
router.put("/update/:id", verifyToken, updateTrainerUserAccountCtrl);

router.put("/update/image/:id", verifyToken, updateTrainerProfilePicture);

// update technical details
router.put("/new/update/:id", verifyToken, updateTechnicalDetails);

// get trainer details in single trainer page profile part
router.get("/get/:id", getTrainerProfileDetailsInSinglePage);

// get trainer courses in single trainer page
router.get("/courses/get/:id", getOnlyTrainerCourses);

// add bank account details to the dbConnection

router.post("/bank/details/add/:id", verifyToken, addBankAccountDetails);

export default router;

import routers from "express";
let router = routers.Router();
import {
  getAllTrainerDetails,
  updateTrainerApprove,
  updateTrainerDisApprove,
  getTrainerDetailsApproveOrNot,
  getOnlyTrainerDetails,
  getAllTrainersDetailsInTrainers,
} from "../controllers/trainerControllers.js";

import {
  verifyToken,
  verifyTokenAndAuthorization,
} from "../middleware/verifyToken.js";

router.get(
  "/getAllTrainers",
  verifyTokenAndAuthorization,
  getAllTrainerDetails
);
// approve trainer route
router.put(
  "/update/approve",
  verifyTokenAndAuthorization,
  updateTrainerApprove
);

// disapprove trainer route
router.put(
  "/update/disapprove",
  verifyTokenAndAuthorization,
  updateTrainerDisApprove
);

// trainer/get/trainer/TrainerDetails
router.get("/get/details/:id", getTrainerDetailsApproveOrNot);

// giving permission to add new course page
router.get("/get/trainer/find/:id", verifyToken, getOnlyTrainerDetails);

// all trainers in trainer section
router.get("/get/all-trainers", getAllTrainersDetailsInTrainers);

export default router;

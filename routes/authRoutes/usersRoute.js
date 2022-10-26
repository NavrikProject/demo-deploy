import routers from "express";
let router = routers.Router();
import {
  getAllTheUsersData,
  getAllTraineeUsersData,
  updateAdminApprove,
  updateAdminDisapprove,
} from "../../controllers/authControllers/usersControllers.js";

import { verifyTokenAndAuthorization } from "../../middleware/verifyToken.js";

//working
router.get("/get", verifyTokenAndAuthorization, getAllTheUsersData);

router.get("/get/trainee", verifyTokenAndAuthorization, getAllTraineeUsersData);
// approve admin route
router.put(
  "/update/approve/:id",
  verifyTokenAndAuthorization,
  updateAdminApprove
);
// disapprove admin route
router.put(
  "/update/disapprove/:id",
  verifyTokenAndAuthorization,
  updateAdminDisapprove
);
export default router;

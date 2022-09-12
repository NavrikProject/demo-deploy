import routers from "express";
let router = routers.Router();
import {
  getAllTheUsersData,
  updateAdminApprove,
  updateAdminDisapprove,
} from "../controllers/usersControllers.js";

import { verifyTokenAndAuthorization } from "../middleware/verifyToken.js";

//working
router.get("/get", verifyTokenAndAuthorization, getAllTheUsersData);

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

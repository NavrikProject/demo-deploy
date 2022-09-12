import routers from "express";
let router = routers.Router();
import {
  emailRegister,
  emailAccountActivation,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/verifyToken.js";

//account registration
router.post("/email-register", emailRegister);
// email account activation
router.post("/email-account-activate/:id", emailAccountActivation);

//login
router.post("/login", login);

// to change password when login is successful
router.put("/change-password/:id", verifyToken, changePassword);

// to forgot password
router.post("/forgot-password", forgotPassword);

// to reset password
router.put("/reset-password/:resetToken", resetPassword);

export default router;

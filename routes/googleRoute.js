import express from "express";
import { googleSignUp } from "../controllers/googleController.js";
let router = express.Router();
router.post("/sign-up", googleSignUp);
export default router;

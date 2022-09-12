import express from "express";
let router = express.Router();

import { getTransactionalDetails } from "../controllers/trainerEarningCtrl.js";

router.get("/account/get/:id", getTransactionalDetails);

export default router;

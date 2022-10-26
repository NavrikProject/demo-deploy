import express from "express";
import { getNotifications } from "../middleware/Notifications.js";

let router = express.Router();

router.get("/", getNotifications);

export default router;

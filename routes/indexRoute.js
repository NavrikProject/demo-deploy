import express from "express";
import { getUsers, homeRoute } from "../controllers/indexController.js";

let router = express.Router();

router.get("/home", homeRoute);
router.get("/users", getUsers);
export default router;

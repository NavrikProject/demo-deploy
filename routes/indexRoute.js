import express from "express";
import { homeRoute } from "../controllers/indexController.js";

let router = express.Router();

router.get("/home", homeRoute);

export default router;

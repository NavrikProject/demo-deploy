import express from "express";
import {
  getData,
  getUsers,
  homeRoute,
} from "../controllers/indexController.js";

let router = express.Router();

router.get("/home", homeRoute);
router.get("/users", getUsers);
router.get("/getFileData", getData);
export default router;

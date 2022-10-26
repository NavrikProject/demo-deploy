import routers from "express";
import { getAllJobDetails } from "../../controllers/jobControllers/jobsController.js";
let router = routers.Router();

router.get("/get/all-jos-posts", getAllJobDetails);

export default router;

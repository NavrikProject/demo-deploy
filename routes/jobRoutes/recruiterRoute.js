import {
  addHiringCompanyDetails,
  createJobPost,
  getFirmAllDetails,
} from "../../controllers/jobControllers/recruiterController.js";
import routers from "express";
let router = routers.Router();

router.post("/add-company-details", addHiringCompanyDetails);

router.get("/get-company-details/:id", getFirmAllDetails);

router.post("/create-job-post/:id", createJobPost);
export default router;

import routers from "express";
import { joinZoomMeeting } from "../controllers/zoomMeetingController.js";
let router = routers.Router();

router.post("/join-meeting", joinZoomMeeting);


export default router;

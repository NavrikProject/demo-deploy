import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
// auth routes import
import authRouter from "./routes/authRoutes/authRoute.js";
import usersRoute from "./routes/authRoutes/usersRoute.js";

// trainer routes import
import trainerRoute from "./routes/trainerRoutes/trainerRoute.js";
import trainerProfileRoute from "./routes/trainerRoutes/trainerProfileRoute.js";
import trainerEarningsRoute from "./routes/trainerRoutes/trainerEarningRoute.js";

//trainee routes import
import traineeProfileRoute from "./routes/traineeRoutes/traineeProfileRoute.js";
import TraineeBookingProfileRoute from "./routes/traineeRoutes/traineeBookingProfileRoute.js";
import traineeCourseRoute from "./routes/traineeRoutes/traineeCourseRoute.js";
import traineeCourseProgressRoute from "./routes/traineeRoutes/traineeCourseProgressRoute.js";
import AdminTraineeCourseRoute from "./routes/AdminTraineeCourseRoutes/AdminTraineeCourseRoutes.js";
// course routes import
import courseRoute from "./routes/courseRoutes/courseRoute.js";
import courseRegdRoute from "./routes/courseRoutes/courseRegdRoute.js";
import corporateCourseRoute from "./routes/courseRoutes/corpCourseRoute.js";

import mentorRoute from "./routes/mentorRoutes/mentorRoute.js";
import mentorBookingRoute from "./routes/mentorRoutes/MentorBookingRoute.js";
import FeedbackRoute from "./routes/feedbackRoutes/feedbackRoute.js";
import ContributersRoute from "./routes/contributerRoutes/contributersRoute.js";
import googleRoute from "./routes/googleRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import rescheduleRoute from "./routes/rescheduleRoute.js";
import recruiterRoute from "./routes/recruiterRoutes/recruiterRoute.js";
import jobsRoute from "./routes/jobPostsRoutes/jobRoute.js";
//import config from "./config/dbconfig.js";
import fs from "fs";
import masterRoute from "./routes/masterRoutes/masterRoute.js";
import HomeRoute from "./routes/indexRoute.js";

const __dirname = path.resolve();

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "/mnt/testing")));

app.use(
  fileUpload({
    createParentPath: true,
  })
);
const port = process.env.PORT || 1337;

app.get("/api/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/", HomeRoute);
// auth routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRoute);

// trainee routes
app.use("/api/trainee/profile/booking", TraineeBookingProfileRoute);
app.use("/api/trainee/profile", traineeProfileRoute);
app.use("/api/trainee/courses", traineeCourseRoute);
app.use("/api/trainee/courses/progress", traineeCourseProgressRoute);

// admin routes
app.use("/api/admin", AdminTraineeCourseRoute);
//trainer routers
app.use("/api/trainer/earnings", trainerEarningsRoute);
app.use("/api/trainer/profile", trainerProfileRoute);
app.use("/api/trainer", trainerRoute);

//mentor routes
app.use("/api/mentor/bookings", mentorBookingRoute);
app.use("/api/mentor", mentorRoute);

//contributers routes
app.use("/api/contributers", ContributersRoute);

// courses routes
app.use("/api/courses/new", courseRegdRoute);
app.use("/api/courses", courseRoute);
app.use("/api/corporate", corporateCourseRoute);

// job recruiter routes
app.use("/api/recruiter", recruiterRoute);

// jobs posts routes
app.use("/api/jobs", jobsRoute);

// master routes
app.use("/api", masterRoute);

// feedback routes
app.use("/api/feedback", FeedbackRoute);
app.use("/api/google", googleRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/reschedule", rescheduleRoute);

app.get("/", (req, res) => {
  const time = new Date().getTime();
  const date = new Date().toDateString();
  return res.send({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});

app.listen(port, (req, res) => {
  console.log("listening on port " + port);
});

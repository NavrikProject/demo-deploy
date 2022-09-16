import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import authRouter from "./routes/authRoute.js";
import courseRoute from "./routes/courseRoute.js";
import courseRegdRoute from "./routes/courseRegdRoute.js";
import usersRoute from "./routes/usersRoute.js";
import trainerRoute from "./routes/trainerRoute.js";
import trainerProfileRoute from "./routes/trainerProfileRoute.js";
import traineeProfileRoute from "./routes/traineeProfileRoute.js";
import trainerEarningsRoute from "./routes/trainerEarningRoute.js";
import corporateCourseRoute from "./routes/corpCourseRoute.js";
import mentorRoute from "./routes/mentorRoute.js";
import TraineeBookingProfileRoute from "./routes/traineeBookingProfileRoute.js";
import mentorBookingRoute from "./routes/MentorBookingRoute.js";
import FeedbackRoute from "./routes/feedbackRoute.js";
import ContributersRoute from "./routes/contributersRoute.js";
import googleRoute from "./routes/googleRoute.js";
import config from "./config/dbconfig.js";
import fs from "fs";
import masterRoute from "./routes/masterRoute.js";
import BlobServiceClient from "@azure/storage-blob";
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
app.use("/api/auth", authRouter);
app.use("/api/courses/new", courseRegdRoute);
app.use("/api/courses", courseRoute);
app.use("/api/trainee", traineeProfileRoute);
app.use("/api/earnings", trainerEarningsRoute);
app.use("/api/trainer/profile", trainerProfileRoute);
app.use("/api/trainer", trainerRoute);
app.use("/api/users", usersRoute);
app.use("/api/corporate", corporateCourseRoute);
app.use("/api/mentor", mentorRoute);
app.use("/api/mentor/profile", TraineeBookingProfileRoute);
app.use("/api/mentor/bookings", mentorBookingRoute);
app.use("/api/feedback", FeedbackRoute);
app.use("/api/contributers", ContributersRoute);
app.use("/api/google", googleRoute);
app.use("/api", masterRoute);

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

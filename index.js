import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import rp from "request-promise";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "./config/dbConfig.js";
import axios from "axios";
import { Vonage } from "@vonage/server-sdk";
// auth routes import
import authRouter from "./routes/authRoutes/authRoute.js";
import usersRoute from "./routes/authRoutes/usersRoute.js";

// trainer routes import
//import trainerRoute from "./routes/trainerRoutes/trainerRoute.js";
//import trainerProfileRoute from "./routes/trainerRoutes/trainerProfileRoute.js";
//import trainerEarningsRoute from "./routes/trainerRoutes/trainerEarningRoute.js";

//trainee routes import
import traineeProfileRoute from "./routes/traineeRoutes/traineeProfileRoute.js";
import TraineeBookingProfileRoute from "./routes/traineeRoutes/traineeBookingProfileRoute.js";
//import traineeCourseRoute from "./routes/traineeRoutes/traineeCourseRoute.js";
//import traineeCourseProgressRoute from "./routes/traineeRoutes/traineeCourseProgressRoute.js";
import AdminTraineeCourseRoute from "./routes/AdminTraineeCourseRoutes/AdminTraineeCourseRoutes.js";
// course routes import
import courseRoute from "./routes/courseRoutes/courseRoute.js";
//import courseRegdRoute from "./routes/courseRoutes/courseRegdRoute.js";
import corporateCourseRoute from "./routes/courseRoutes/corpCourseRoute.js";

// jobs applications import
import JobsApplyRoute from "./routes/jobPostsRoutes/jobsApplyRoute.js";

// job seeker routes import
import jobSeekerRoute from "./routes/jobSeekerRoutes/jobSeekerRoutes.js";

import mentorRoute from "./routes/mentorRoutes/mentorRoute.js";
import mentorBookingRoute from "./routes/mentorRoutes/MentorBookingRoute.js";
import mentorProfileRoute from "./routes/mentorRoutes/mentorProfileRoute.js";
import mentorRegisterRoute from "./routes/mentorRoutes/mentorRegisterRoute.js";

import FeedbackRoute from "./routes/feedbackRoutes/feedbackRoute.js";
//import ContributersRoute from "./routes/contributerRoutes/contributersRoute.js";
import googleRoute from "./routes/googleRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import rescheduleRoute from "./routes/rescheduleRoute.js";
import recruiterRoute from "./routes/recruiterRoutes/recruiterRoute.js";
import jobsRoute from "./routes/jobPostsRoutes/jobRoute.js";
//import config from "./config/dbconfig.js";
import masterRoute from "./routes/masterRoutes/masterRoute.js";
import HomeRoute from "./routes/indexRoute.js";
import sgMail from "@sendgrid/mail";
import { BlockBlobClient } from "@azure/storage-blob";
import intoStream from "into-stream";
import { accountCreatedEmailTemplate } from "./middleware/authEmailTemplate.js";
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
app.use("/api/member/profile", traineeProfileRoute);
//app.use("/api/trainee/courses", traineeCourseRoute);
//app.use("/api/trainee/courses/progress", traineeCourseProgressRoute);

// admin routes
app.use("/api/admin", AdminTraineeCourseRoute);
//trainer routers
//app.use("/api/trainer/earnings", trainerEarningsRoute);
//app.use("/api/trainer/profile", trainerProfileRoute);
//app.use("/api/trainer", trainerRoute);

//mentor routes
app.use("/api/mentor/bookings", mentorBookingRoute);
app.use("/api/mentor", mentorRoute);
app.use("/api/mentor/profile", mentorProfileRoute);
app.use("/api/mentor/register", mentorRegisterRoute);

//contributers routes
//app.use("/api/contributers", ContributersRoute);

// courses routes
//app.use("/api/courses/new", courseRegdRoute);
app.use("/api/courses", courseRoute);
app.use("/api/corporate", corporateCourseRoute);

// job recruiter routes
app.use("/api/recruiter", recruiterRoute);

// jobs posts routes
app.use("/api/jobs", jobsRoute);
app.use("/api/jobs/apply", JobsApplyRoute);

// job seeker routers
app.use("/api/job-seeker", jobSeekerRoute);

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
  // sql.connect(config, (err) => {
  //   if (err) return res.send(err.message);
  //   const request = new sql.Request();
  //   request.query(
  //     "select user_email from users_dtls where user_email ='keeprememberall@gmail.com'",
  //     (err, result) => {
  //       if (err) return res.send(err.message);
  //       if (result) {
  //         res.json({ success: result.recordset });
  //       }
  //     }
  //   );
  // });
  return res.send({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});
const payload = {
  iss: process.env.ZOOM_APP_API_KEY,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_APP_API_SECRET_KEY);

app.get("/meetings", async (req, res) => {
  try {
    const email = "b.mahesh311296@gmail.com"; //host email id;
    const result = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Discussion about today's Demo",
        type: 2,
        start_time: "2021-03-18T17:00:00",
        duration: 20,
        timezone: "India",
        password: "1234567",
        agenda: "We will discuss about Today's Demo process",
        settings: {
          host_video: true,
          participant_video: true,
          cn_meeting: false,
          in_meeting: true,
          join_before_host: false,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 2,
          audio: "both",
          auto_recording: "local",
          enforce_login: false,
          registrants_email_notification: true,
          waiting_room: true,
          allow_multiple_devices: true,
          email: email,
        },
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json",
        },
      }
    );
    if (result) {
      return res.json({ success: result.data });
    } else {
      return res.json({ error: result.error });
    }
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/send-email", (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = accountCreatedEmailTemplate(
    "b.mahesh311296@gmail.com",
    "Mahesh bandari"
  );
  sgMail
    .send(msg)
    .then(() => {
      res.send({
        success: "Successfully email sent",
      });
    })
    .catch((error) => {
      res.send({
        error: error.message,
      });
    });
});

// app.post("/upload-image", async (req, res) => {
//   const blobName = new Date().getTime() + "-" + req.files.image.name;
//   const filename = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
//   const blobService = new BlockBlobClient(
//     process.env.AZURE_STORAGE_CONNECTION_STRING,
//     "practiwizcontainer/mentorprofilepictures",
//     blobName
//   );
//   const stream = intoStream(req.files.image.data);
//   const streamLength = req.files.image.data.length;

//   blobService
//     .uploadStream(stream, streamLength)
//     .then((response) => {
//       return res.send({ success: filename });
//     })
//     .catch((err) => {
//       return res.send({ error: "There was an error uploading" });
//     });
// });

app.get("/send-sms", async (req, res) => {
  // const vonage = new Vonage({
  //   apiKey: "5c1f377e ",
  //   apiSecret: "c0QXia5GPkpyAyYF",
  // });
  // const from = "Vonage APIs";
  // const to = "918466958669";
  // const text = "A text message sent using the Vonage SMS API";
  // await vonage.sms
  //   .send({ to, from, text })
  //   .then((resp) => {
  //     console.log("Message sent successfully");
  //     res.json(resp);
  //   })
  //   .catch((err) => {
  //     console.log("There was an error sending the messages.");
  //     console.error(err);
  //   });
});
app.listen(port, (req, res) => {
  console.log("listening on port " + port);
});

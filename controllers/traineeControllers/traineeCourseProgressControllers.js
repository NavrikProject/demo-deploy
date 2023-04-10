// import sql from "mssql";
// import config from "../../config/dbconfig.js";
// import dotenv from "dotenv";
// import { traineeCourseFeedbackSubmissionEmail } from "../../middleware/traineeEmailTemplates.js";
// import sgMail from "@sendgrid/mail";

// dotenv.config();

// export async function getTraineeInCompleteCourses(req, res) {
//   const email = req.body.email;
//   try {
//     sql.connect(config, (err) => {
//       if (err) return res.send({ err: err.message });
//       const request = new sql.Request();
//       request.input("email", sql.VarChar, email);
//       request.query(
//         "select * from trainee_courses_dtls where trainee_course_email = @email and trainee_course_complete_status = 'incomplete'",
//         (err, result) => {
//           if (err) return res.send({ err: err.message });
//           if (result.recordset.length > 0) {
//             return res.send({ success: result.recordset });
//           } else {
//             return res.send({ error: "" });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.send({ error: "" });
//   }
// }

// export async function getTraineeCompleteCourses(req, res) {
//   const userEmail = req.body.email;
//   try {
//     sql.connect(config, (err) => {
//       if (err) return res.send({ err: err.message });
//       const request = new sql.Request();
//       request.input("userEmail", sql.VarChar, userEmail);
//       request.query(
//         "select * from trainee_courses_dtls where trainee_course_email = @userEmail and trainee_course_complete_status = 'completed' ",
//         (err, result) => {
//           if (err) return res.send({ err: err.message });
//           if (result.recordset.length > 0) {
//             return res.send({ success: result.recordset });
//           } else {
//             return res.send({ error: "" });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.send({ error: "" });
//   }
// }

// export async function getTraineeLiveClassDetails(req, res) {
//   const { userEmail, traineeCourseId } = req.body;
//   try {
//     sql.connect(config, (err) => {
//       if (err) return res.send({ error: err.message });
//       const request = new sql.Request();
//       request.input("userEmail", sql.VarChar, userEmail);
//       request.input("traineeCourseId", sql.Int, traineeCourseId);
//       request.query(
//         "select * from instructor_live_classes_dtls where trainee_email = @userEmail and trainee_course_id = @traineeCourseId and instructor_live_class_completed_status = 'pending' ",
//         (err, result) => {
//           if (err) return res.send({ error: err.message });
//           if (result.recordset.length > 0) {
//             return res.send({ success: result.recordset });
//           } else {
//             return res.send({ error: " " });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.send({ error: " " });
//   }
// }
// export async function getTraineeLiveAttendedLiveClassDetails(req, res) {
//   const { userEmail, traineeCourseId } = req.body;
//   try {
//     sql.connect(config, (err) => {
//       if (err) return res.send({ error: err.message });
//       const request = new sql.Request();
//       request.input("userEmail", sql.VarChar, userEmail);
//       request.input("traineeCourseId", sql.Int, traineeCourseId);
//       request.query(
//         "select * from instructor_live_classes_dtls where trainee_email = @userEmail and trainee_course_id = @traineeCourseId and instructor_live_class_completed_status = 'completed' ",
//         (err, result) => {
//           if (err) return res.send({ error: err.message });
//           if (result.recordset.length > 0) {
//             return res.send({ success: result.recordset });
//           } else {
//             return res.send({ error: " " });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.send({ error: " " });
//   }
// }
// export async function insertTraineeCourseFeedBackController(req, res) {
//   let {
//     question1,
//     question2,
//     question3,
//     question4,
//     question5,
//     question6,
//     question7,
//     traineeCourseDtlsId,
//     userEmail,
//     userFullName,
//     instructorFullname,
//     traineeCourseId,
//     courseName,
//   } = req.body;

//   try {
//     sql.connect(config, (err) => {
//       if (err) return res.send(err.message);
//       const request = new sql.Request();
//       request.input("traineeCourseDtlsId", sql.Int, traineeCourseDtlsId);
//       request.input("traineeCourseId", sql.Int, traineeCourseId);
//       request.query(
//         "select * from trainee_course_feedback_dtls where trainee_course_dtls_id = @traineeCourseDtlsId and trainee_course_id = @traineeCourseId",
//         (err, result) => {
//           if (err)
//             return res.send({
//               error: err.message,
//             });
//           if (result.recordset.length > 0) {
//             return res.send({
//               error: "You have all ready submitted the feedback",
//             });
//           } else {
//             sql.connect(config, async (err) => {
//               if (err)
//                 return res.send({
//                   error: err.message,
//                 });
//               const request = new sql.Request();
//               request.query(
//                 "insert into trainee_course_feedback_dtls (trainee_course_dtls_id,trainee_course_id,trainee_feedback_user_email,trainee_feedback_instructor_name,trainee_feedback_course_name,trainee_course_feedback_quality_qn1,trainee_course_feedback_time_qn2,trainee_course_feedback_content_qn3,trainee_course_feedback_material_qn4,trainee_course_feedback_improve_qn5,trainee_course_feedback_expectation_qn6,trainee_course_feedback__overall_qn7,trainee_course_feedback_cr_date) VALUES('" +
//                   traineeCourseDtlsId +
//                   "','" +
//                   traineeCourseId +
//                   "','" +
//                   userEmail +
//                   "','" +
//                   instructorFullname +
//                   "','" +
//                   courseName +
//                   "','" +
//                   question1 +
//                   "','" +
//                   question2 +
//                   "','" +
//                   question3 +
//                   "','" +
//                   question4 +
//                   "','" +
//                   question5 +
//                   "','" +
//                   question6 +
//                   "','" +
//                   question7 +
//                   "','" +
//                   new Date().toISOString().substring(0, 10) +
//                   "' )",
//                 (err, success) => {
//                   if (err) {
//                     return (
//                       res.send({
//                         error: err.message,
//                       }),
//                       console.log(err.message)
//                     );
//                   }
//                   if (success) {
//                     request.query(
//                       "select * from trainee_courses_dtls where trainee_course_progress_status = 'completed' and trainee_course_complete_status = 'incomplete' and trainee_course_progress_percentage = 100 and trainee_course_email_sent_status = 5 and trainee_course_status = '16'",
//                       (err, results) => {
//                         if (err) return console.log(err.message);
//                         if (results.recordset.length > 0) {
//                           results?.recordset?.forEach((recordset) => {
//                             const traineeCourseId =
//                               recordset.trainee_course_dtls_id;
//                             const traineeEmail = recordset.trainee_course_email;
//                             const traineeName = recordset.trainee_fullname;
//                             sql.connect(config, (err) => {
//                               if (err) return console.log(err.message);
//                               const request = new sql.Request();
//                               request.input("id", sql.Int, traineeCourseId);
//                               const sqlUpdate =
//                                 "UPDATE trainee_courses_dtls SET trainee_course_email_sent_status = 6,trainee_course_complete_status = 'completed',trainee_course_status = '17' WHERE trainee_course_dtls_id = @id";
//                               request.query(sqlUpdate, (err, result) => {
//                                 if (err)
//                                   return console.log({
//                                     error: err.message,
//                                   });
//                                 if (result) {
//                                   sgMail.setApiKey(
//                                     process.env.SENDGRID_API_KEY
//                                   );
//                                   const msg =
//                                     traineeCourseFeedbackSubmissionEmail(
//                                       traineeEmail,
//                                       traineeName
//                                     );
//                                   sgMail
//                                     .send(msg)
//                                     .then(() => {
//                                       return res.send({
//                                         success:
//                                           "Thanks you for your valuable feedback!",
//                                       });
//                                     })
//                                     .catch((error) => {
//                                       return res.send({
//                                         error:
//                                           "There was an error while submitting your feedback",
//                                       });
//                                     });
//                                 } else {
//                                   return res.send({
//                                     error:
//                                       "There was an error while submitting your feedback",
//                                   });
//                                 }
//                               });
//                             });
//                           });
//                         } else {
//                           return res.send({
//                             error:
//                               "There was an error while submitting your feedback",
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.send({
//       error: "There was an error while submitting your feedback",
//     });
//   }
// }

import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import { sendFeedbackEmail } from "../middleware/sendRemainder.js";
import path from "path";
import fs from "fs";
const __dirname = path.resolve();

export async function insertFeedBackController(req, res) {
  let {
    userFullName,
    mentorFullname,
    bookingId,
    userEmail,
    mentorEmail,
    question1,
    question2,
    question3,
    question4,
    question5,
    question6,
    question7,
    question8,
    question9,
    question10,
    question11,
  } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("bookingId", sql.Int, bookingId);
      request.query(
        "select * from booking_appointments_dtls where user_email = @userEmail AND booking_appt_id = @bookingId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const rewardPoints =
              result.recordset[0].trainee_and_mentor_reward_points;
            const sessionStatus = "completed";
            const request = new sql.Request();
            request.input("userEmail", sql.VarChar, userEmail);
            request.input("sessionStatus", sql.VarChar, sessionStatus);
            request.input("bookingId", sql.Int, bookingId);
            const sqlUpdate =
              "UPDATE booking_appointments_dtls SET trainee_session_status = @sessionStatus, mentor_session_status = @sessionStatus WHERE booking_appt_id= @bookingId AND user_email = @userEmail";
            request.query(sqlUpdate, (err, result) => {
              if (err) return res.send(err.message);
              if (result) {
                sql.connect(config, (err) => {
                  if (err) return res.send(err.message);
                  const request = new sql.Request();
                  request.input("userEmail", sql.VarChar, userEmail);
                  request.input("bookingId", sql.Int, bookingId);
                  request.query(
                    "select * from trainee_dtls where trainee_email = @userEmail",
                    (err, result) => {
                      if (err) return res.send(err.message);
                      if (result.recordset.length > 0) {
                        const previousRewardPoints =
                          result.recordset[0].trainee_points;
                        const totalRewardPoints =
                          rewardPoints + previousRewardPoints;
                        const request = new sql.Request();
                        request.input(
                          "totalRewardPoints",
                          sql.Int,
                          totalRewardPoints
                        );
                        request.input("userEmail", sql.VarChar, userEmail);
                        const sqlUpdate =
                          "UPDATE trainee_dtls SET trainee_points = @totalRewardPoints WHERE trainee_email = @userEmail";
                        request.query(sqlUpdate, (err, result) => {
                          if (err) return res.send(err.message);
                          if (result) {
                            sql.connect(config, (err) => {
                              if (err) return res.send(err.message);
                              const request = new sql.Request();
                              request.input("bookingId", sql.Int, bookingId);
                              request.query(
                                "select * from trainee_feedback_dtls where trainee_feedback_booking_id = @bookingId",
                                (err, result) => {
                                  if (err) return res.send(err.message);
                                  if (result.recordset.length > 0) {
                                    return res.send({
                                      error:
                                        "You have all ready submitted the feedback",
                                    });
                                  } else {
                                    sql.connect(config, async (err) => {
                                      if (err) res.send(err.message);
                                      const request = new sql.Request();
                                      request.query(
                                        "insert into trainee_feedback_dtls (trainee_feedback_booking_id,trainee_fullname,mentor_fullname,trainee_feedback_user_email,trainee_feedback_mentor_email,trainee_feedback_useful,trainee_feedback_structure,trainee_feedback_relevant,trainee_feedback_clear,trainee_feedback_teaching,trainee_feedback_material,trainee_feedback_ad_time,trainee_feedback_learn_wp,trainee_feedback_aspects,trainee_feedback_improve_mentor,trainee_feedback_overall_exp,trainee_feedback_cr_date) VALUES('" +
                                          bookingId +
                                          "','" +
                                          userFullName +
                                          "','" +
                                          mentorFullname +
                                          "','" +
                                          userEmail +
                                          "','" +
                                          mentorEmail +
                                          "','" +
                                          question1 +
                                          "','" +
                                          question2 +
                                          "','" +
                                          question3 +
                                          "','" +
                                          question4 +
                                          "','" +
                                          question5 +
                                          "','" +
                                          question6 +
                                          "','" +
                                          question7 +
                                          "','" +
                                          question8 +
                                          "','" +
                                          question9 +
                                          "','" +
                                          question10 +
                                          "','" +
                                          question11 +
                                          "','" +
                                          new Date()
                                            .toISOString()
                                            .substring(0, 10) +
                                          "' )",
                                        (err, success) => {
                                          if (err) {
                                            return res.send({
                                              error: err.message,
                                            });
                                          }
                                          if (success) {
                                            sgMail.setApiKey(
                                              process.env.SENDGRID_API_KEY
                                            );
                                            const msg = sendFeedbackEmail(
                                              userEmail,
                                              "Feedback submission",
                                              "submitted the feedback"
                                            );
                                            sgMail
                                              .send(msg)
                                              .then(() => {
                                                return res.send({
                                                  success:
                                                    "Thanks for your valuable feedback",
                                                });
                                              })
                                              .catch((error) => {
                                                return res.send({
                                                  error:
                                                    "There was an error while submitting the feedback",
                                                });
                                              });
                                          }
                                        }
                                      );
                                    });
                                  }
                                }
                              );
                            });
                          }
                        });
                      } else {
                        return;
                      }
                    }
                  );
                });
              }
            });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {}
}

export async function getFeedbackMentorController(req, res, next) {
  const { userEmail, bookingId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("bookingId", sql.Int, bookingId);
      request.query(
        "select * from trainee_feedback_dtls where trainee_feedback_booking_id = @bookingId and trainee_feedback_mentor_email = @userEmail",
        (err, result) => {
          if (err) {
            return res.send(err.message);
          }
          if (result.recordset.length > 0) {
            return res.send({ data: result.recordset });
          } else {
            return res.send("");
          }
        }
      );
    });
  } catch (error) {}
}

export async function getFeedbackByMentorName(req, res) {
  let mentorName = req.query.name;
  mentorName = mentorName.split("-");
  mentorName = mentorName[0] + " " + mentorName[1];
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("mentorName", sql.VarChar, mentorName);
      request.query(
        "select * from trainee_feedback_dtls where mentor_fullname = @mentorName ORDER BY trainee_feedback_dtls_id DESC",
        (err, result) => {
          if (err) {
            return res.send(err.message);
          }
          if (result.recordset.length > 0) {
            return res.send({ data: result.recordset });
          } else {
            return res.send("");
          }
        }
      );
    });
  } catch (error) {}
}
export async function insertContactUsDetails(req, res) {
  const { fullname, email, query, text, value } = req.body;
  try {
    sql.connect(config, async (err) => {
      if (err) res.send(err.message);
      const request = new sql.Request();
      request.query(
        "insert into contact_us_dtls (contact_us_fullname,contact_us_email,contact_us_phone_number,contact_us_cr_date,contact_us_query,contact_us_text) VALUES('" +
          fullname +
          "','" +
          email +
          "','" +
          value +
          "','" +
          new Date().toISOString().substring(0, 10) +
          "','" +
          query +
          "','" +
          text +
          "' )",
        (err, success) => {
          if (err) {
            return res.send({ error: err.message });
          }
          if (success) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = sendFeedbackEmail(
              email,
              "contact us form submitted",
              "Thanks for contacting the practiwiz"
            );
            sgMail
              .send(msg)
              .then(() => {
                return res.send({
                  success: "Thanks for your submission we will get back to you",
                });
              })
              .catch((error) => {
                return res.send({
                  error: "There was an error while submitting the feedback",
                });
              });
          }
        }
      );
    });
  } catch (error) {}
}

export async function uploadImage(req, res, next) {
  if (!req.files || !Object.keys(req.files).length === 0) {
    return res.status(480).send(" No files were uploaded . ");
  }
  const file = req.files.image;

  file.mv(
    `${__dirname}/mnt/testing/${new Date().getTime() + file.name}`,
    (err) => {
      if (err)
        return res.send({ err: "There was an error uploading the file" });
      return res.send({ message: "The file was uploaded successfully" });
    }
  );
}

export async function getTheImage() {
  fs.writeFileSync(
    `${__dirname}/mnt/testing/mynewfile2.txt`,
    "w",
    "Hello world"
  );
  fs.close();
}

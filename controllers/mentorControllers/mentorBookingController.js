import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import axios from "axios";
import schedule from "node-schedule";
import {
  traineeBookingRemainderEmailTemplate,
  traineeFeedbackEmail,
  traineeRescheduledMentorUpdatedEmailTemplate,
} from "../../middleware/traineeEmailTemplates.js";
import {
  mentorBookingRemainderEmailTemplate,
  mentorCancelledRefundEmailTemplate,
  mentorJoinedSessionEmail,
  mentorRescheduledUpdateEmailTemplate,
} from "../../middleware/mentorEmailTemplates.js";
dotenv.config();
const payload = {
  iss: process.env.ZOOM_APP_API_KEY,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_APP_API_SECRET_KEY);
export async function getAllMentorBookingsInProfile(req, res, next) {
  const { mentorEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("mentorEmail", sql.VarChar, mentorEmail);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @mentorEmail",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                id: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                userEmail: mentor.user_email,
                amount: mentor.mentor_amount,
                bookingDate: mentor.booking_mentor_date,
                bookedOn: mentor.booking_date,
                time: mentor.booking_time,
                confirmed: mentor.mentor_booking_confirmed,
                changes: mentor.trainee_modification_changed_times,
                mentorId: mentor.mentor_dtls_id,
                hostUrl: mentor.mentor_host_url,
                amountStatus: mentor.mentor_amount_paid_status,
                sessionStatus: mentor.mentor_session_status,
              };
              mentorArray.push(data);
            });
            return res.send(mentorArray);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

export async function updateTheConfirmAppointment(req, res, next) {
  const paramsId = req.params.id;
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.input("paramsId", sql.Int, paramsId);
      request.query(
        "SELECT * FROM booking_appointments_dtls WHERE booking_appt_id = @paramsId ",
        (err, result) => {
          if (err) res.send(err.message);
          if (result.recordset.length > 0) {
            const booking = result.recordset[0].mentor_booking_confirmed;
            var email = result.recordset[0].user_email;
            if (booking === "No") {
              const confirm = "Yes";
              const request = new sql.Request();
              request.input("confirm", sql.VarChar, confirm);
              request.input("paramsId", sql.Int, paramsId);
              const sqlUpdate =
                "UPDATE booking_appointments_dtls SET mentor_booking_confirmed =@confirm WHERE booking_appt_id = @paramsId";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = {
                    from: "no-reply@practilearn.com",
                    to: email,
                    subject: "Mentor Booking confirm email",
                    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Practiwiz Training Programme</h2>
                          <p> You're mentor has approved the session.
                          </p>
                          Do not reply this email address
                          </div>`,
                  };
                  sgMail
                    .send(msg)
                    .then(() => {
                      res.send({
                        success: "Successfully approved the session ",
                      });
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                } else {
                  res.send({
                    error: "There was an error updating",
                  });
                }
              });
            }
          } else {
            res.send("No user found");
          }
        }
      );
    });
  } catch (error) {
    if (error) res.send(error.message);
  }
}

export async function cancelAppointmentWithTrainee(req, res, next) {
  const { reason, reasonExp } = req.body;
  let bookingId = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) {
        return res.send(err.message);
      }
      const request = new sql.Request();
      request.input("bookingId", sql.Int, bookingId);
      request.query(
        "select * from booking_appointments_dtls where booking_appt_id = @bookingId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let amount = result.recordset[0].mentor_amount;
            let email = result.recordset[0].user_email;
            const username = result.recordset[0].user_fullname;
            const paymentId = result.recordset[0].mentor_razorpay_payment_id;
            var refundAmount = amount;
            const instance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
            });
            instance.payments
              .refund(paymentId, {
                amount: refundAmount * 100,
                speed: "optimum",
              })
              .then((data) => {
                let refundId = data.id;
                var newRefundAmount = data.amount;
                newRefundAmount = newRefundAmount / 100;
                sql.connect(config, (err) => {
                  if (err) {
                    return res.send(err.message);
                  }
                  const request = new sql.Request();
                  request.input("bookingId", sql.Int, bookingId);
                  request.query(
                    "select * from modify_and_refund_payment_dtls WHERE booking_appt_id = @bookingId",
                    (err, result) => {
                      if (err) return res.send(err.message);
                      if (result.recordset.length > 0) {
                        sql.connect(config, (err) => {
                          if (err) return res.send(err.message);
                          const request = new sql.Request();
                          request.input("bookingId", sql.Int, bookingId);
                          request.input(
                            "newRefundAmount",
                            sql.Int,
                            newRefundAmount
                          );
                          request.input("refundId", sql.VarChar, refundId);
                          let newModifyDate = new Date()
                            .toISOString()
                            .substring(0, 10);
                          request.input(
                            "newModifyDate",
                            sql.Date,
                            newModifyDate
                          );
                          request.input("reason", sql.VarChar, reason);
                          request.input("reasonExp", sql.VarChar, reasonExp);
                          const sqlUpdate =
                            "UPDATE modify_and_refund_payment_dtls SET mentor_reason= @reason, mentor_reason_explain = @reasonExp, refund_date = @newModifyDate,refund_payment_amount = @newRefundAmount, refund_razorpay_payment_id= @refundId WHERE booking_appt_id= @bookingId";
                          request.query(sqlUpdate, (err, result) => {
                            if (err) return res.send(err.message);
                            if (result) {
                              sql.connect(config, (err) => {
                                if (err) return res.send(err.message);
                                let amountPaidStatus = "Refunded";
                                const sessionStatus = "cancelled";
                                request.input(
                                  "amountPaidStatus",
                                  sql.VarChar,
                                  amountPaidStatus
                                );
                                request.input(
                                  "sessionStatus",
                                  sql.VarChar,
                                  sessionStatus
                                );
                                const sqlUpdate =
                                  "UPDATE booking_appointments_dtls SET mentor_amount_paid_status = @amountPaidStatus,trainee_session_status = @sessionStatus, mentor_session_status = @sessionStatus WHERE booking_appt_id= @bookingId ";
                                request.query(sqlUpdate, (err, result) => {
                                  if (err) return res.send(err.message);
                                  if (result) {
                                    sgMail.setApiKey(
                                      process.env.SENDGRID_API_KEY
                                    );
                                    const msg =
                                      mentorCancelledRefundEmailTemplate(
                                        email,
                                        username
                                      );
                                    sgMail
                                      .send(msg)
                                      .then(() => {
                                        res.send({
                                          success:
                                            "Successfully refund is initiated",
                                        });
                                      })
                                      .catch((error) => {
                                        res.send({
                                          error:
                                            "There was an error while booking the appointment",
                                        });
                                      });
                                  } else {
                                    return res.send({
                                      error: err.message,
                                    });
                                  }
                                });
                              });
                            } else {
                              res.send({
                                error: err.message,
                              });
                            }
                          });
                        });
                      } else {
                        sql.connect(config, async (err) => {
                          if (err) res.send(err.message);
                          const request = new sql.Request();
                          request.input("bookingId", sql.Int, bookingId);
                          request.query(
                            "insert into modify_and_refund_payment_dtls (booking_appt_id,user_email,trainee_reason,trainee_reason_explain,refund_date,refund_payment_amount,refund_razorpay_payment_id) VALUES('" +
                              bookingId +
                              "','" +
                              email +
                              "','" +
                              reason +
                              "','" +
                              reasonExp +
                              "','" +
                              new Date().toISOString().substring(0, 10) +
                              "','" +
                              newRefundAmount +
                              "','" +
                              refundId +
                              "' )",
                            (err, success) => {
                              if (err) {
                                return (
                                  res.send({ error: err.message }),
                                  console.log(err.message)
                                );
                              }
                              if (success) {
                                sql.connect(config, (err) => {
                                  if (err) return res.send(err.message);
                                  let amountPaidStatus = "Refunded";
                                  const sessionStatus = "cancelled";
                                  request.input(
                                    "amountPaidStatus",
                                    sql.VarChar,
                                    amountPaidStatus
                                  );
                                  request.input(
                                    "sessionStatus",
                                    sql.VarChar,
                                    sessionStatus
                                  );
                                  const sqlUpdate =
                                    "UPDATE booking_appointments_dtls SET mentor_amount_paid_status = @amountPaidStatus,trainee_session_status = @sessionStatus, mentor_session_status = @sessionStatus WHERE booking_appt_id= @bookingId ";
                                  request.query(sqlUpdate, (err, result) => {
                                    if (err) return res.send(err.message);
                                    if (result) {
                                      sgMail.setApiKey(
                                        process.env.SENDGRID_API_KEY
                                      );
                                      const msg =
                                        mentorCancelledRefundEmailTemplate(
                                          email,
                                          username
                                        );
                                      sgMail
                                        .send(msg)
                                        .then(() => {
                                          res.send({
                                            success:
                                              "Successfully refund is initiated",
                                          });
                                        })
                                        .catch((error) => {
                                          res.send({
                                            error:
                                              "There was an error while booking the appointment",
                                          });
                                        });
                                    } else {
                                      return res.send({
                                        error: err.message,
                                      });
                                    }
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
              })
              .catch((error) => {
                return res.send({
                  error: error.message,
                });
              });
          } else {
            return res.send({
              error: "There is an error while creating the order",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({
      error: "There was an error updating",
    });
  }
}

export async function getMentorAllUpcomingSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const upcoming = "upcoming";
      const paid = "Paid";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("upcoming", sql.VarChar, upcoming);
      request.input("paid", sql.VarChar, paid);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @userEmail AND mentor_session_status = @upcoming AND mentor_amount_paid_status = @paid ORDER BY booking_appt_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                bookingId: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                mentorFullName: mentor.mentor_name,
                userEmail: mentor.user_email,
                bookingDate: mentor.booking_mentor_date,
                time: mentor.booking_time,
                confirmed: mentor.mentor_booking_confirmed,
                mentorId: mentor.mentor_dtls_id,
                hostUrl: mentor.mentor_host_url,
                sessionStatus: mentor.mentor_session_status,
                username: mentor.user_fullname,
              };
              mentorArray.push(data);
            });
            return res.send({ details: mentorArray });
          } else {
            return res.send();
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

export async function updateMentorAttendedSessions(req, res, next) {
  const { userEmail, bookingId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("bookingId", sql.Int, bookingId);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @userEmail AND booking_appt_id = @bookingId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let traineeEmail = result.recordset[0].user_email;
            const mentorName = result.recordset[0].mentor_name;
            const bookingDate = new Date(
              result.recordset[0].booking_mentor_date
            ).toDateString();
            const slotTime = result.recordset[0].booking_time;
            const username = result.recordset[0].user_fullname;
            const sessionStatus = "attended";
            const request = new sql.Request();
            request.input("userEmail", sql.VarChar, userEmail);
            request.input("sessionStatus", sql.VarChar, sessionStatus);
            request.input("bookingId", sql.Int, bookingId);
            const sqlUpdate =
              "UPDATE booking_appointments_dtls SET mentor_session_status = @sessionStatus WHERE booking_appt_id= @bookingId AND mentor_email = @userEmail";
            request.query(sqlUpdate, (err, result) => {
              if (err) return res.send(err.message);
              if (result) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorJoinedSessionEmail(
                  traineeEmail,
                  username,
                  mentorName,
                  bookingDate,
                  slotTime,
                  "https://www.practiwiz.com/trainee/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    console.log("Email Sent to join the mentor session");
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              }
            });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}
export async function getMentorAllAttendedSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const attended = "attended";
      const paid = "Paid";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("attended", sql.VarChar, attended);
      request.input("paid", sql.VarChar, paid);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @userEmail AND mentor_session_status = @attended AND mentor_amount_paid_status = @paid ORDER BY booking_appt_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                bookingId: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                mentorFullName: mentor.mentor_name,
                bookingDate: mentor.booking_mentor_date,
                time: mentor.booking_time,
                mentorId: mentor.mentor_dtls_id,
                userEmail: mentor.user_email,
                sessionStatus: mentor.mentor_session_status,
                username: mentor.user_fullname,
              };
              mentorArray.push(data);
            });
            return res.send({ details: mentorArray });
          } else {
            return res.send();
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}
export async function getMentorAllCompletedSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const completed = "completed";
      const paid = "Paid";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("completed", sql.VarChar, completed);
      request.input("paid", sql.VarChar, paid);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @userEmail AND mentor_session_status = @completed AND mentor_amount_paid_status = @paid AND trainee_session_status = @completed ORDER BY booking_appt_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                bookingId: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                bookingDate: mentor.booking_mentor_date,
                time: mentor.booking_time,
                mentorId: mentor.mentor_dtls_id,
                mentorFullName: mentor.mentor_name,
                paymentStatus: mentor.mentor_amount_paid_status,
                username: mentor.user_fullname,
              };
              mentorArray.push(data);
            });
            return res.send({ details: mentorArray });
          } else {
            return res.send("");
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}
export async function getMentorAllCancelledSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const cancelled = "cancelled";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("cancelled", sql.VarChar, cancelled);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @userEmail AND mentor_session_status = @cancelled ORDER BY booking_appt_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                bookingId: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                amount: mentor.mentor_amount,
                mentorFullName: mentor.mentor_name,
                bookingDate: mentor.booking_mentor_date,
                time: mentor.booking_time,
                paymentStatus: mentor.mentor_amount_paid_status,
                mentorId: mentor.mentor_dtls_id,
                username: mentor.user_fullname,
              };
              mentorArray.push(data);
            });
            return res.send({ details: mentorArray });
          } else {
            return res.send("");
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}
export async function getMentorAllNotAttendedSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const unattended = "unattended";
      const paid = "Paid";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("unattended", sql.VarChar, unattended);
      request.input("paid", sql.VarChar, paid);
      request.query(
        "select * from booking_appointments_dtls where mentor_email = @userEmail AND mentor_session_status = @unattended AND mentor_amount_paid_status = @paid ORDER BY booking_appt_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                bookingId: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                mentorFullName: mentor.mentor_name,
                bookingDate: mentor.booking_mentor_date,
                time: mentor.booking_time,
                mentorId: mentor.mentor_dtls_id,
                userEmail: mentor.user_email,
                sessionStatus: mentor.mentor_session_status,
                rescheduleTimes: mentor.mentor_rescheduled_times,
                username: mentor.user_fullname,
              };
              mentorArray.push(data);
            });
            return res.send({ details: mentorArray });
          } else {
            return res.send();
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

export async function rescheduleBookingDateOfMentor(req, res) {
  let bookingId = req.params.id;
  let date = req.body.date;
  let userEmail = req.body.userEmail;
  date = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
  try {
    const result = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Discussion with mentor",
        type: 2,
        start_time: "2021-03-18T17:00:00",
        duration: 20,
        timezone: "India",
        password: "1234567",
        agenda: "Discussion with mentor",
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
          email: userEmail,
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
      let mentorHostUrl = result.data.start_url;
      let traineeJoinUrl = result.data.join_url;
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.input("bookingId", sql.Int, bookingId);
        request.query(
          "select * from booking_appointments_dtls where booking_appt_id = @bookingId",
          (err, result) => {
            if (err) return res.send(err.message);
            if (result.recordset.length > 0) {
              const traineeName = result.recordset[0].user_fullname;
              const mentorName = result.recordset[0].mentor_name;
              const slotTime = result.recordset[0].booking_time;
              const bookingId = result.recordset[0].booking_appt_id;
              let mentorEmail = result.recordset[0].mentor_email;
              const newUserEmail = result.recordset[0].user_email;
              const bookingChanges = 1;
              const request = new sql.Request();
              request.input("bookingChanges", sql.Int, bookingChanges);
              request.input("bookingId", sql.Int, bookingId);
              request.input("date", sql.Date, date);
              request.input("mentorHostUrl", sql.VarChar, mentorHostUrl);
              request.input("traineeJoinUrl", sql.VarChar, traineeJoinUrl);
              const newDate = new Date();
              request.input("newDate", sql.Date, newDate);
              const sqlUpdate =
                "UPDATE booking_appointments_dtls SET booking_mentor_date = @date, booking_date = @newDate,trainee_session_status = 'upcoming',mentor_session_status = 'upcoming', mentor_rescheduled_times = @bookingChanges, mentor_host_url = @mentorHostUrl, trainee_join_url = @traineeJoinUrl WHERE booking_appt_id= @bookingId";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  const changedDate = new Date(
                    new Date(date).setDate(new Date(date).getDate() - 1)
                  ).toDateString();
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = traineeRescheduledMentorUpdatedEmailTemplate(
                    newUserEmail,
                    traineeName,
                    mentorName,
                    changedDate,
                    slotTime
                  );
                  sgMail
                    .send(msg)
                    .then(() => {
                      const msg = mentorRescheduledUpdateEmailTemplate(
                        mentorEmail,
                        traineeName,
                        mentorName,
                        changedDate,
                        slotTime
                      );
                      sgMail
                        .send(msg)
                        .then(() => {
                          res.send({
                            success:
                              "Successfully rescheduled appointment booking date is changed",
                          });
                        })
                        .catch((error) => {
                          res.send({
                            error:
                              "There was an error while booking the appointment",
                          });
                        });
                    })
                    .catch((error) => {
                      res.send({
                        error:
                          "There was an error while booking the appointment",
                      });
                    });
                } else {
                  res.send({
                    error: err.message,
                  });
                }
              });
            } else {
              return res.send({ error: "Couldn't find booking'" });
            }
          }
        );
      });
    }
  } catch (error) {
    return res.send({ error: "There was an error updating the booking" });
  }
}

// remainder will be sent on before 10 minutes to mentor
function sentEmailRemainderToMentorAndTraineeBefore10Min(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const mentorSessionsStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("mentorSessionsStatus", sql.VarChar, mentorSessionsStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND mentor_session_status = @mentorSessionsStatus",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            const mentorName = res.mentor_name;
            let mentorEmail = res.mentor_email;
            const bookingDate = new Date(
              res.booking_mentor_date
            ).toDateString();
            const slotTime = res.booking_time;
            const username = res.user_fullname;
            let year = new Date(res.booking_mentor_date).getFullYear();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_starts_time.split(":")[0];
            let min = res.booking_starts_time.split(":")[1];
            var date = new Date(year, month, day, hour, min, 0);
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 40); //for 10 minutes before
            if (min === "00") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "10",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "10",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 10 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "15") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "10",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "10",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 10 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "30") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "10",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "10",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 10 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "45") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "10",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "10",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 10 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
          });
        }
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

// remainder will be sent on before 5 minutes to mentor
function sentEmailRemainderToMentorAndTraineeBefore5Min(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const mentorSessionsStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("mentorSessionsStatus", sql.VarChar, mentorSessionsStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND mentor_session_status = @mentorSessionsStatus",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            const mentorName = res.mentor_name;
            let mentorEmail = res.mentor_email;
            const bookingDate = new Date(
              res.booking_mentor_date
            ).toDateString();
            const slotTime = res.booking_time;
            const username = res.user_fullname;
            let year = new Date(res.booking_mentor_date).getFullYear();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_starts_time.split(":")[0];
            let min = res.booking_starts_time.split(":")[1];
            var date = new Date(year, month, day, hour, min, 0);
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 35); //for 10 minutes before
            if (min === "00") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "5",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "5",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 5 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "15") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "5",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "5",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 5 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "30") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "5",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "5",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 5 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "45") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "5",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "5",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 5 minutes");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
          });
        }
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

// remainder will be sent to start trainee and host
function sentEmailRemainderToMentorAndTraineeToStart(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const mentorSessionsStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("mentorSessionsStatus", sql.VarChar, mentorSessionsStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND mentor_session_status = @mentorSessionsStatus",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            const mentorName = res.mentor_name;
            let mentorEmail = res.mentor_email;
            const bookingDate = new Date(
              res.booking_mentor_date
            ).toDateString();
            const slotTime = res.booking_time;
            const username = res.user_fullname;
            let year = new Date(res.booking_mentor_date).getFullYear();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_starts_time.split(":")[0];
            let min = res.booking_starts_time.split(":")[1];
            var date = new Date(year, month, day, hour, min, 0);
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 30);
            if (min === "00") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "0",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "0",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent to start");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "15") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "0",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "0",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent to start");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "30") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "0",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "0",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent to start");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "45") {
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = mentorBookingRemainderEmailTemplate(
                  mentorEmail,
                  mentorName,
                  username,
                  bookingDate,
                  slotTime,
                  "0",
                  "https://www.practiwiz.com/mentor/profile/my-sessions"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeBookingRemainderEmailTemplate(
                      traineeEmail,
                      username,
                      mentorName,
                      bookingDate,
                      slotTime,
                      "0",
                      "https://www.practiwiz.com/trainee/profile/my-sessions"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent to start");
                      })
                      .catch((error) => {
                        console.log(error.message);
                      });
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
          });
        }
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

// email sent to fill the feedback
function sentEmailRemainderToFillFeedback(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res?.send(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "attended";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus AND mentor_session_status = @traineeSessionStatus",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let year = new Date(res.booking_mentor_date).getFullYear();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            const username = res.user_fullname;
            let hour = res.booking_end_time.split(":")[0];
            let min = res.booking_end_time.split(":")[1];
            var date = new Date(year, month, day, hour, min, 0);
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 30);
            schedule.scheduleJob(date, function () {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = traineeFeedbackEmail(traineeEmail, username);
              sgMail
                .send(msg)
                .then(() => {
                  console.log("feedback form Sent");
                })
                .catch((error) => {
                  console.log(error.message);
                });
            });
          });
        }
      );
    });
  } catch (error) {}
}
// remainder will be sent on before 10 minutes function call
sentEmailRemainderToMentorAndTraineeBefore10Min();
sentEmailRemainderToMentorAndTraineeBefore5Min();
sentEmailRemainderToFillFeedback();
sentEmailRemainderToMentorAndTraineeToStart();

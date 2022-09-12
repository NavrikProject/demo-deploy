import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import updateEmail from "../middleware/updateEmail.js";
import jwt from "jsonwebtoken";
import rp from "request-promise";
import { sendRemainderOnTheDay } from "../middleware/sendRemainder.js";
import schedule from "node-schedule";
dotenv.config();

// in trainee profile
export async function getAllMentorBookings(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("userEmail", sql.VarChar, userEmail);
      request.query(
        "select * from booking_appointments_dtls where user_email = @userEmail",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                bookingId: mentor.booking_appt_id,
                mentorEmail: mentor.mentor_email,
                userEmail: mentor.user_email,
                amount: mentor.mentor_amount,
                bookingDate: mentor.booking_mentor_date,
                bookedOn: mentor.booking_date,
                time: mentor.booking_time,
                confirmed: mentor.mentor_booking_confirmed,
                changes: mentor.trainee_modification_changed_times,
                paymentStatus: mentor.mentor_amount_paid_status,
                mentorId: mentor.mentor_dtls_id,
                traineeJoinUrl: mentor.trainee_join_url,
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

export async function getMentorAvailability(req, res, next) {
  const { mentorEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("mentorEmail", sql.VarChar, mentorEmail);
      request.query(
        "select * from mentor_dtls where mentor_email = @mentorEmail",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            let mentorArray = [];
            result.recordset.forEach((mentor) => {
              let data = {
                availability: mentor.mentor_availability,
                endDate: mentor.mentor_available_end_date,
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

// get mentor booking dates in trainee profile
export async function getBookingDatesOfOnlyMentor(req, res) {
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
                mentorId: mentor.mentor_dtls_id,
                bookedDate: new Date(
                  mentor.booking_mentor_date
                ).toLocaleDateString(),
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

const payload = {
  iss: process.env.ZOOM_APP_API_KEY,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_APP_API_SECRET_KEY);
// update booking date for one time
export async function modifyBookingDate(req, res) {
  let bookingId = req.params.id;
  let date = req.body.date;
  let userEmail = req.body.userEmail;
  date = new Date(new Date(date).setDate(new Date(date).getDate() + 1));

  try {
    var options = {
      method: "POST",
      uri: "https://api.zoom.us/v2/users/me/meetings",
      body: {
        topic: "Appointment booking",
        type: 1,
        start_time: new Date(date),
        contact_email: userEmail,
        registrants_email_notification: true,
        calendar_type: 2,
        recurrence: {
          end_date_time: new Date(date),
          end_times: 7,
          monthly_day: 1,
          monthly_week: 1,
          monthly_week_day: 1,
          repeat_interval: 1,
          type: 1,
          weekly_days: "1",
        },
        settings: {
          host_video: "true",
          participant_video: "true",
        },
      },
      auth: {
        bearer: token,
      },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
      },
      json: true, //Parse the JSON string in the response
    };
    rp(options)
      .then(function (response) {
        let mentorHostUrl = response.start_url;
        let traineeJoinUrl = response.join_url;
        sql.connect(config, (err) => {
          if (err) return res.send(err.message);
          const request = new sql.Request();
          request.input("bookingId", sql.Int, bookingId);
          request.query(
            "select * from booking_appointments_dtls where booking_appt_id = @bookingId",
            (err, result) => {
              if (err) return res.send(err.message);
              if (result.recordset.length > 0) {
                const bookingId = result.recordset[0].booking_appt_id;
                let mentorEmail = result.recordset[0].mentor_email;
                const changes = 1;
                const request = new sql.Request();
                request.input("changes", sql.Int, changes);
                request.input("bookingId", sql.Int, bookingId);
                request.input("date", sql.Date, date);
                request.input("mentorHostUrl", sql.Text, mentorHostUrl);
                request.input("traineeJoinUrl", sql.VarChar, traineeJoinUrl);
                const newDate = new Date();
                request.input("newDate", sql.Date, newDate);
                const sqlUpdate =
                  "UPDATE booking_appointments_dtls SET booking_mentor_date = @date, booking_date = @newDate, trainee_modification_changed_times = @changes, mentor_host_url = @mentorHostUrl, trainee_join_url = @traineeJoinUrl WHERE booking_appt_id= @bookingId";
                request.query(sqlUpdate, (err, result) => {
                  if (err) return res.send(err.message);
                  if (result) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = updateEmail(
                      userEmail,
                      "Appointment Booking date is changed",
                      "Successfully appointment booking date is changed, "
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        const msg = updateEmail(
                          mentorEmail,
                          "Appointment Booking changed",
                          "Some one has booked changed the booking date "
                        );
                        sgMail
                          .send(msg)
                          .then(() => {
                            res.send({
                              success:
                                "Successfully appointment booking date is changed",
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
                      error: error.message,
                    });
                  }
                });
              } else {
                return res.send({ error: "Couldn't find booking'" });
              }
            }
          );
        });
      })
      .catch(function (err) {
        return res.send({ error: err.message });
      });
  } catch (error) {
    console.log(err.message);
  }

  try {
  } catch (error) {
    return res.send({
      error: error.message,
    });
  }
}

//create and modify order razorpay order
export async function modifyCreateOrder(req, res) {
  const { bookingId, date } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) {
        return res.send(err.message);
      }
      const request = new sql.Request();
      request.input("date", sql.Date, date);
      request.input("bookingId", sql.Int, bookingId);
      request.query(
        "select * from booking_appointments_dtls where booking_appt_id = @bookingId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const mentorPrice = result.recordset[0].mentor_amount;
            const instance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
            });
            const options = {
              amount: (mentorPrice * 100) / 20,
              currency: "INR",
            };
            instance.orders
              .create(options)
              .then((order) => {
                res.send(order);
              })
              .catch((error) => {
                return res.send({ error: error.message });
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

//create and update the booking time for second time and make payment
export async function modifyAppointmentAndMakePayment(req, res, next) {
  const { bookingId, razorpayPaymentId } = req.body;
  let date = req.body.date;
  var amount = req.body.amount;
  amount = amount / 100;
  date = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
  let userEmail = req.body.userEmail;

  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/me/meetings",
    body: {
      topic: "Appointment booking",
      type: 1,
      start_time: new Date(date),
      contact_email: userEmail,
      registrants_email_notification: true,
      calendar_type: 2,
      recurrence: {
        end_date_time: new Date(date),
        end_times: 7,
        monthly_day: 1,
        monthly_week: 1,
        monthly_week_day: 1,
        repeat_interval: 1,
        type: 1,
        weekly_days: "1",
      },
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };

  rp(options)
    .then(function (response) {
      let mentorHostUrl = response.start_url;
      let traineeJoinUrl = response.join_url;
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.input("bookingId", sql.Int, bookingId);
        request.query(
          "select * from booking_appointments_dtls where booking_appt_id = @bookingId",
          (err, result) => {
            if (err) return res.send(err.message);
            if (result.recordset.length > 0) {
              let mentorEmail = result.recordset[0].mentor_email;
              const changes = 2;
              const request = new sql.Request();
              request.input("bookingId", sql.Int, bookingId);
              request.input("changes", sql.Int, changes);
              request.input("date", sql.Date, date);
              const newDate = new Date();
              request.input("newDate", sql.Date, newDate);
              request.input("mentorHostUrl", sql.Text, mentorHostUrl);
              request.input("traineeJoinUrl", sql.VarChar, traineeJoinUrl);
              const sqlUpdate =
                "UPDATE booking_appointments_dtls SET booking_mentor_date = @date, booking_date = @newDate, trainee_modification_changed_times = @changes, mentor_host_url = @mentorHostUrl, trainee_join_url = @traineeJoinUrl WHERE booking_appt_id= @bookingId";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  sql.connect(config, (err) => {
                    if (err) {
                      return res.send(err.message);
                    }
                    const request = new sql.Request();
                    request.input("bookingId", sql.Int, bookingId);
                    request.query(
                      "select * from modify_and_refund_payment_dtls where booking_appt_id = @bookingId",
                      (err, result) => {
                        if (err) return res.send(err.message);
                        if (result.recordset.length > 0) {
                          sql.connect(config, (err) => {
                            if (err) return res.send(err.message);
                            const request = new sql.Request();
                            request.input("bookingId", sql.Int, bookingId);
                            request.input("amount", sql.Int, amount);
                            request.input(
                              "razorpayPaymentId",
                              sql.VarChar,
                              razorpayPaymentId
                            );
                          });
                          let newModifyDate = new Date()
                            .toISOString()
                            .substring(0, 10);
                          request.input(
                            "newModifyDate",
                            sql.Date,
                            newModifyDate
                          );
                          const sqlUpdate =
                            "UPDATE modify_and_refund_payment_dtls SET modify_date = @newModifyDate,  modify_payment_amount = @amount, modify_razorpay_payment_id= @razorpayPaymentId WHERE booking_appt_id= @bookingId";
                          request.query(sqlUpdate, (err, result) => {
                            if (err) return res.send(err.message);
                            if (result) {
                              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                              const msg = updateEmail(
                                userEmail,
                                "Appointment Booking date is changed",
                                "Successfully appointment booking date is changed,The link is given below "
                              );
                              sgMail
                                .send(msg)
                                .then(() => {
                                  const msg = updateEmail(
                                    mentorEmail,
                                    "Appointment Booking changed",
                                    "Some one has changed the booking date click the link to join the meeting "
                                  );
                                  sgMail
                                    .send(msg)
                                    .then(() => {
                                      res.send({
                                        success:
                                          "Successfully appointment booking date is changed",
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
                                error: error.message,
                              });
                            }
                          });
                        } else {
                          sql.connect(config, async (err) => {
                            if (err) res.send(err.message);
                            const request = new sql.Request();
                            request.input("bookingId", sql.Int, bookingId);
                            request.input("amount", sql.Int, amount);
                            request.input(
                              "razorpayPaymentId",
                              sql.VarChar,
                              razorpayPaymentId
                            );
                            console.log(amount);
                            request.query(
                              "insert into modify_and_refund_payment_dtls (booking_appt_id,user_email,modify_date,modify_payment_amount,modify_razorpay_payment_id) VALUES('" +
                                bookingId +
                                "','" +
                                userEmail +
                                "','" +
                                new Date().toISOString().substring(0, 10) +
                                "','" +
                                amount +
                                "','" +
                                razorpayPaymentId +
                                "' )",
                              (err, success) => {
                                if (err) {
                                  return res.send({ error: err.message });
                                }
                                if (success) {
                                  sgMail.setApiKey(
                                    process.env.SENDGRID_API_KEY
                                  );
                                  const msg = updateEmail(
                                    userEmail,
                                    "Appointment Booking date is changed",
                                    "Successfully appointment booking date is changed,The link is given below "
                                  );
                                  sgMail
                                    .send(msg)
                                    .then(() => {
                                      const msg = updateEmail(
                                        mentorEmail,
                                        "Appointment Booking changed",
                                        "Some one has changed the booking date click the link to join the meeting "
                                      );
                                      sgMail
                                        .send(msg)
                                        .then(() => {
                                          res.send({
                                            success:
                                              "Successfully appointment booking date is changed",
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
                                }
                              }
                            );
                          });
                        }
                      }
                    );
                  });
                } else {
                  res.send({
                    error: "There was an error updating",
                  });
                }
              });
            } else {
              return res.send({ error: "Couldn't find booking'" });
            }
          }
        );
      });
    })
    .catch(function (err) {
      return res.send({ error: err.message });
    });

  try {
  } catch (error) {}
}

// issue for refund
export async function issueRefundForBooking(req, res, next) {
  const { bookingId, reason, selected } = req.body;
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
            const paymentId = result.recordset[0].mentor_razorpay_payment_id;
            var refundAmount = amount - amount / 10;
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
                          request.input("selected", sql.VarChar, selected);
                          request.input("reason", sql.Text, reason);
                          const sqlUpdate =
                            "UPDATE modify_and_refund_payment_dtls SET trainee_reason= @selected, trainee_reason_explain = @reason, refund_date = @newModifyDate,refund_payment_amount = @newRefundAmount, refund_razorpay_payment_id= @refundId WHERE booking_appt_id= @bookingId";
                          request.query(sqlUpdate, (err, result) => {
                            if (err) return res.send(err.message);
                            if (result) {
                              sql.connect(config, (err) => {
                                if (err) return res.send(err.message);
                                let amountPaidStatus = "Refunded";
                                const sessionStatus = "refunded";
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
                                    const msg = updateEmail(
                                      email,
                                      "Refund email",
                                      "Successfully initiated the refund process"
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
                                error: error.message,
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
                              selected +
                              "','" +
                              reason +
                              "','" +
                              new Date().toISOString().substring(0, 10) +
                              "','" +
                              refundAmount +
                              "','" +
                              refundId +
                              "' )",
                            (err, success) => {
                              if (err) {
                                return res.send({ error: err.message });
                              }
                              if (success) {
                                sql.connect(config, (err) => {
                                  if (err) return res.send(err.message);
                                  let amountPaidStatus = "Refunded";
                                  const sessionStatus = "refunded";
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
                                      const msg = updateEmail(
                                        email,
                                        "Refund email",
                                        "Successfully initiated the refund process"
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

export async function getAllUpcomingSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const upcoming = "upcoming";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("upcoming", sql.VarChar, upcoming);
      request.query(
        "select * from booking_appointments_dtls where user_email = @userEmail AND trainee_session_status = @upcoming ORDER BY booking_appt_id DESC",
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
                changes: mentor.trainee_modification_changed_times,
                paymentStatus: mentor.mentor_amount_paid_status,
                mentorId: mentor.mentor_dtls_id,
                traineeJoinUrl: mentor.trainee_join_url,
                sessionStatus: mentor.trainee_session_status,
                rewardPoints: mentor.trainee_and_mentor_reward_points,
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

export async function updateAttendedSessions(req, res, next) {
  const { userEmail, bookingId } = req.body;
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
            const sessionStatus = "attended";
            const request = new sql.Request();
            request.input("userEmail", sql.VarChar, userEmail);
            request.input("sessionStatus", sql.VarChar, sessionStatus);
            request.input("bookingId", sql.Int, bookingId);
            const sqlUpdate =
              "UPDATE booking_appointments_dtls SET trainee_session_status = @sessionStatus WHERE booking_appt_id= @bookingId AND user_email = @userEmail";
            request.query(sqlUpdate, (err, result) => {
              if (err) return res.send(err.message);
              if (result) {
                return res.send("Attended");
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
export async function getAllAttendedSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const attended = "attended";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("attended", sql.VarChar, attended);
      request.query(
        "select * from booking_appointments_dtls where user_email = @userEmail AND trainee_session_status = @attended ORDER BY booking_appt_id DESC",
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
                sessionStatus: mentor.trainee_session_status,
                paymentStatus: mentor.mentor_amount_paid_status,
                rewardPoints: mentor.trainee_and_mentor_reward_points,
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
export async function getAllCompletedSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const completed = "completed";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("completed", sql.VarChar, completed);
      request.query(
        "select * from booking_appointments_dtls where user_email = @userEmail AND trainee_session_status = @completed ORDER BY booking_appt_id DESC",
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
                rewardPoints: mentor.trainee_and_mentor_reward_points,
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
export async function getAllRefundedSessions(req, res, next) {
  const { userEmail } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const refunded = "refunded";
      request.input("userEmail", sql.VarChar, userEmail);
      request.input("refunded", sql.VarChar, refunded);
      request.query(
        "select * from booking_appointments_dtls where user_email = @userEmail AND trainee_session_status = @refunded ORDER BY booking_appt_id DESC",
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

//remainder email will be sent before one day to trainee
function sentEmailRemainderBeforeOneDayToTrainee(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus",
        (err, result) => {
          result.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let traineeJoinUrl = res.trainee_join_url;
            let year = new Date(res.booking_mentor_date).getDay();
            let month = new Date(res.booking_mentor_date).getMonth();
            var day = new Date(res.booking_mentor_date).getDate();
            day = day - 1;
            const date = new Date(year, month, day, 0, 0, 0);
            schedule.scheduleJob(date, function () {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = sendRemainderOnTheDay(
                traineeEmail,
                "Remainder for the session",
                traineeJoinUrl,
                "Join Meeting"
              );
              sgMail
                .send(msg)
                .then(() => {
                  console.log("Sent");
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

// remainder will be sent on the day to trainee
function sentEmailRemainderOnTheDayToTrainee(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus",
        (err, result) => {
          result.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let traineeJoinUrl = res.trainee_join_url;
            let year = new Date(res.booking_mentor_date).getFullYear();
            let month = new Date(res.booking_mentor_date).getMonth();
            var day = new Date(res.booking_mentor_date).getDate();
            const date = new Date(year, month, day, 0, 0, 0);
            schedule.scheduleJob(date, function () {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = sendRemainderOnTheDay(
                traineeEmail,
                "Remainder for the session",
                traineeJoinUrl,
                "Join Meeting"
              );
              sgMail
                .send(msg)
                .then(() => {
                  console.log("Sent");
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

// remainder will be sent on before 10 minutes to trainee
function sentEmailRemainderToTraineeBefore10Min(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus",
        (err, result) => {
          result.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let traineeJoinUrl = res.trainee_join_url;
            let year = new Date(res.booking_mentor_date).getDay();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_starts_time.split(":")[0];
            let min = res.booking_starts_time.split(":")[1];
            if (min === "00") {
              hour = hour - 1;
              const date = new Date(year, month, day, hour, 50, 0);
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = sendRemainderOnTheDay(
                  traineeEmail,
                  "Remainder for the session will start in 10 minutes",
                  traineeJoinUrl,
                  "Join Meeting"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    console.log("Sent");
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "30") {
              min = min - 10;
              const date = new Date(year, month, day, hour, min, 0);
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = sendRemainderOnTheDay(
                  traineeEmail,
                  "Remainder for the session will start in 10 minutes",
                  traineeJoinUrl,
                  "Start Meeting"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    console.log("Sent");
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
  } catch (error) {}
}

// remainder will be sent on before 5 minutes to trainee
function sentEmailRemainderToTraineeBefore5Min(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus",
        (err, result) => {
          result.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let traineeJoinUrl = res.trainee_join_url;
            let year = new Date(res.booking_mentor_date).getDay();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_starts_time.split(":")[0];
            let min = res.booking_starts_time.split(":")[1];
            if (min === "00") {
              hour = hour - 1;
              const date = new Date(year, month, day, hour, 55, 0);
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = sendRemainderOnTheDay(
                  traineeEmail,
                  "Remainder for the session will start in 5 minutes",
                  traineeJoinUrl,
                  "Join Meeting"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    console.log("Sent");
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              });
            }
            if (min === "30") {
              min = min - 5;
              const date = new Date(year, month, day, hour, min, 0);
              schedule.scheduleJob(date, function () {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = sendRemainderOnTheDay(
                  traineeEmail,
                  "Remainder for the session will start in 5 minutes",
                  traineeJoinUrl,
                  "Join Meeting"
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    console.log("Sent");
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
  } catch (error) {}
}

function sentEmailRemainderToTraineeToStart(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "upcoming";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus",
        (err, result) => {
          result.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let traineeJoinUrl = res.trainee_join_url;
            let year = new Date(res.booking_mentor_date).getDay();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_starts_time.split(":")[0];
            let min = res.booking_starts_time.split(":")[1];
            const date = new Date(year, month, day, hour, min, 0);
            schedule.scheduleJob(date, function () {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = sendRemainderOnTheDay(
                traineeEmail,
                "Remainder for the session is stared",
                traineeJoinUrl,
                "Join Meeting"
              );
              sgMail
                .send(msg)
                .then(() => {
                  console.log("Sent");
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

function sentEmailRemainderToFillFeedback(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      const amountPaidStatus = "Paid";
      const traineeSessionStatus = "attended";
      request.input("amountPaidStatus", sql.VarChar, amountPaidStatus);
      request.input("traineeSessionStatus", sql.VarChar, traineeSessionStatus);
      request.query(
        "select * from booking_appointments_dtls where mentor_amount_paid_status = @amountPaidStatus AND trainee_session_status = @traineeSessionStatus",
        (err, result) => {
          result.recordset.forEach((res) => {
            let traineeEmail = res.user_email;
            let year = new Date(res.booking_mentor_date).getDay();
            let month = new Date(res.booking_mentor_date).getMonth();
            let day = new Date(res.booking_mentor_date).getDate();
            let hour = res.booking_end_time.split(":")[0];
            console.log(hour);
            const date = new Date(year, month, day, hour, 0, 0);
            schedule.scheduleJob(date, function () {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = sendRemainderOnTheDay(
                traineeEmail,
                "Remainder for to fill the feedback form",
                "http://localhost:3000/trainee/profile/bookings",
                "Give feedback"
              );
              sgMail
                .send(msg)
                .then(() => {
                  console.log("Sent");
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

sentEmailRemainderToFillFeedback();
//remainder email will be sent before one day function call
sentEmailRemainderBeforeOneDayToTrainee();

// remainder will be sent on the day function call
sentEmailRemainderOnTheDayToTrainee();

// remainder will be sent on before 10 minutes function call
sentEmailRemainderToTraineeBefore10Min();

// remainder will be sent on before 5 minutes function call
sentEmailRemainderToTraineeBefore5Min();

// remainder will be sent to start or join meeting function call
sentEmailRemainderToTraineeToStart();

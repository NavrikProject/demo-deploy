import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import { traineeRescheduleEmailSentTemplate } from "../middleware/traineeEmailTemplates.js";
import { mentorRescheduleEmailSentTemplate } from "../middleware/mentorEmailTemplates.js";

export async function rescheduleBookingAppointment(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from booking_appointments_dtls",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

function checkTheDateAndStatusChangeOfTrainee(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from booking_appointments_dtls where trainee_session_status = 'upcoming' and mentor_session_status = 'attended' and mentor_amount_paid_status = 'Paid' and trainee_rescheduled_times= '0' ",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            result.recordset.forEach((recordset) => {
              const bookingAppointmentId = recordset.booking_appt_id;
              const mentorName = recordset.mentor_name;
              const traineeName = recordset.user_fullname;
              const slotTime = recordset.booking_time;
              const bookingDate = new Date(
                recordset.booking_mentor_date
              ).toDateString();
              const traineeEmail = recordset.user_email;
              let previousDate = new Date();
              previousDate.setDate(previousDate.getDate() - 1);
              let dayBeforePreviousDate = new Date();
              dayBeforePreviousDate.setDate(
                dayBeforePreviousDate.getDate() - 2
              );
              if (
                previousDate.toLocaleDateString() ===
                  new Date(
                    recordset.booking_mentor_date
                  ).toLocaleDateString() ||
                dayBeforePreviousDate.toLocaleDateString() ===
                  new Date(recordset.booking_mentor_date).toLocaleDateString()
              ) {
                const request = new sql.Request();
                request.input("id", sql.Int, bookingAppointmentId);
                const sqlUpdate =
                  "UPDATE booking_appointments_dtls SET trainee_session_status = 'unattended' WHERE booking_appt_id= @id ";
                request.query(sqlUpdate, (err, result) => {
                  if (err) return console.log(err.message);
                  if (result) {
                    request.input("traineeEmail", sql.VarChar, traineeEmail);
                    request.query(
                      "select * from trainee_dtls where trainee_email = @traineeEmail",
                      (err, result) => {
                        if (result.recordset.length === 0) {
                          request.query(
                            "INSERT INTO trainee_dtls (trainee_email,trainee_unattended_sessions) VALUES('" +
                              traineeEmail +
                              "','" +
                              1 +
                              "' )",
                            (err, result) => {
                              if (err) return res.send(err.message);
                              if (result) {
                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                const msg = traineeRescheduleEmailSentTemplate(
                                  traineeEmail,
                                  traineeName,
                                  mentorName,
                                  bookingDate,
                                  slotTime,
                                  "http://localhost:3000/trainee/profile/my-sessions"
                                );
                                sgMail
                                  .send(msg)
                                  .then(() => {
                                    return res.send({
                                      success:
                                        "Successfully reschedule email sent",
                                    });
                                  })
                                  .catch((error) => {
                                    return console.log({
                                      error:
                                        "There is some error while sending",
                                    });
                                  });
                              }
                            }
                          );
                        }
                        if (result.recordset.length > 0) {
                          const traineeId = result.recordset[0].trainee_id;
                          const sessions =
                            result.recordset[0].trainee_unattended_sessions;
                          const totalSessions = sessions + 1;
                          request.input(
                            "totalSessions",
                            sql.Int,
                            totalSessions
                          );
                          request.input("traineeId", sql.VarChar, traineeId);
                          request.query(
                            "UPDATE trainee_dtls SET trainee_unattended_sessions = @totalSessions WHERE trainee_id = @traineeId",
                            (err, response) => {
                              if (err) {
                                return console.log({
                                  error: err.message,
                                });
                              }
                              if (response) {
                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                const msg = traineeRescheduleEmailSentTemplate(
                                  traineeEmail,
                                  traineeName,
                                  mentorName,
                                  bookingDate,
                                  slotTime,
                                  "http://localhost:3000/trainee/profile/my-sessions"
                                );
                                sgMail
                                  .send(msg)
                                  .then(() => {
                                    return console.log({
                                      success:
                                        "Successfully reschedule email sent",
                                    });
                                  })
                                  .catch((error) => {
                                    return console.log({
                                      error: "There is some error while saving",
                                    });
                                  });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

function checkTheDateAndStatusChangeOfMentor(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from booking_appointments_dtls where mentor_session_status = 'upcoming' and trainee_session_status = 'attended' and mentor_amount_paid_status = 'Paid' and mentor_rescheduled_times= '0'",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            result.recordset.forEach((recordset) => {
              const bookingAppointmentId = recordset.booking_appt_id;
              const mentorName = recordset.mentor_name;
              const traineeName = recordset.user_fullname;
              const slotTime = recordset.booking_time;
              const bookingDate = new Date(
                recordset.booking_mentor_date
              ).toDateString();
              const mentorEmail = recordset.mentor_email;
              let previousDate = new Date();
              previousDate.setDate(previousDate.getDate() - 1);
              let dayBeforePreviousDate = new Date();
              dayBeforePreviousDate.setDate(
                dayBeforePreviousDate.getDate() - 2
              );
              if (
                previousDate.toLocaleDateString() ===
                  new Date(
                    recordset.booking_mentor_date
                  ).toLocaleDateString() ||
                dayBeforePreviousDate.toLocaleDateString() ===
                  new Date(recordset.booking_mentor_date).toLocaleDateString()
              ) {
                const request = new sql.Request();
                request.input("id", sql.Int, bookingAppointmentId);
                const sqlUpdate =
                  "UPDATE booking_appointments_dtls SET mentor_session_status = 'unattended' WHERE booking_appt_id= @id ";
                request.query(sqlUpdate, (err, result) => {
                  if (result) {
                    request.input("mentorEmail", sql.VarChar, mentorEmail);
                    request.query(
                      "select * from mentor_dtls where mentor_email = @mentorEmail and mentor_approved = 'Yes' ",
                      (err, result) => {
                        if (result.recordset.length > 0) {
                          const mentorId = result.recordset[0].mentor_dtls_id;
                          const sessions =
                            result.recordset[0].mentor_unattended_sessions;
                          const totalSessions = sessions + 1;
                          request.input(
                            "totalSessions",
                            sql.Int,
                            totalSessions
                          );
                          request.input("mentorId", sql.VarChar, mentorId);
                          request.query(
                            "UPDATE mentor_dtls SET mentor_unattended_sessions = @totalSessions WHERE mentor_dtls_id = @mentorId",
                            (err, response) => {
                              if (err) {
                                return console.log({
                                  error: err.message,
                                });
                              }
                              if (response) {
                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                const msg = mentorRescheduleEmailSentTemplate(
                                  mentorEmail,
                                  mentorName,
                                  traineeName,
                                  bookingDate,
                                  slotTime,
                                  "http://localhost:3000/mentor/profile/my-sessions"
                                );
                                sgMail
                                  .send(msg)
                                  .then(() => {
                                    return console.log({
                                      success:
                                        "Successfully reschedule email sent",
                                    });
                                  })
                                  .catch((error) => {
                                    return console.log({
                                      error: "There is some error while saving",
                                    });
                                  });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

function checkTheDateAndStatusChangeOfTraineeANdMentor(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from booking_appointments_dtls where trainee_session_status = 'upcoming' and mentor_session_status = 'upcoming' and mentor_amount_paid_status = 'Paid' and mentor_rescheduled_times= '0' and trainee_rescheduled_times = '0'",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            result.recordset.forEach((recordset) => {
              const bookingAppointmentId = recordset.booking_appt_id;
              const mentorName = recordset.mentor_name;
              const traineeName = recordset.user_fullname;
              const slotTime = recordset.booking_time;
              const bookingDate = new Date(
                recordset.booking_mentor_date
              ).toDateString();
              const traineeEmail = recordset.user_email;
              const mentorEmail = recordset.mentor_email;
              let previousDate = new Date();
              previousDate.setDate(previousDate.getDate() - 1);
              let dayBeforePreviousDate = new Date();
              dayBeforePreviousDate.setDate(
                dayBeforePreviousDate.getDate() - 2
              );
              if (
                previousDate.toLocaleDateString() ===
                  new Date(
                    recordset.booking_mentor_date
                  ).toLocaleDateString() ||
                dayBeforePreviousDate.toLocaleDateString() ===
                  new Date(recordset.booking_mentor_date).toLocaleDateString()
              ) {
                const request = new sql.Request();
                request.input("id", sql.Int, bookingAppointmentId);
                const sqlUpdate =
                  "UPDATE booking_appointments_dtls SET trainee_session_status = 'unattended', mentor_session_status = 'unattended' WHERE booking_appt_id= @id ";
                request.query(sqlUpdate, (err, result) => {
                  if (err) return console.log(err.message);
                  if (result) {
                    request.input("mentorEmail", sql.VarChar, mentorEmail);
                    request.query(
                      "select * from mentor_dtls where mentor_email = @mentorEmail and mentor_approved = 'Yes' ",
                      (err, result) => {
                        if (err) return console.log(err.message);
                        if (result.recordset.length > 0) {
                          const mentorId = result.recordset[0].mentor_dtls_id;
                          const sessions =
                            result.recordset[0].mentor_unattended_sessions;
                          const mentorTotalSessions = sessions + 1;
                          request.input(
                            "mentorTotalSessions",
                            sql.Int,
                            mentorTotalSessions
                          );
                          request.input("mentorId", sql.VarChar, mentorId);
                          request.query(
                            "UPDATE mentor_dtls SET mentor_unattended_sessions = @mentorTotalSessions WHERE mentor_dtls_id = @mentorId",
                            (err, response) => {
                              if (err) {
                                return console.log({
                                  error: err.message,
                                });
                              }
                              if (response) {
                                request.input(
                                  "traineeEmail",
                                  sql.VarChar,
                                  traineeEmail
                                );
                                request.query(
                                  "select * from trainee_dtls where trainee_email = @traineeEmail",
                                  (err, result) => {
                                    if (err) return console.log(err.message);
                                    if (result.recordset.length === 0) {
                                      request.query(
                                        "INSERT INTO trainee_dtls (trainee_email,trainee_unattended_sessions) VALUES('" +
                                          traineeEmail +
                                          "','" +
                                          1 +
                                          "' )",
                                        (err, result) => {
                                          if (err) return res.send(err.message);
                                          if (result) {
                                            sgMail.setApiKey(
                                              process.env.SENDGRID_API_KEY
                                            );
                                            const msg =
                                              traineeRescheduleEmailSentTemplate(
                                                traineeEmail,
                                                traineeName,
                                                mentorName,
                                                bookingDate,
                                                slotTime,
                                                "http://localhost:3000/trainee/profile/my-sessions"
                                              );
                                            sgMail
                                              .send(msg)
                                              .then(() => {
                                                return res.send({
                                                  success:
                                                    "Successfully reschedule email sent",
                                                });
                                              })
                                              .catch((error) => {
                                                return console.log({
                                                  error: error.message,
                                                });
                                              });
                                          }
                                        }
                                      );
                                    }
                                    if (result.recordset.length > 0) {
                                      const traineeId =
                                        result.recordset[0].trainee_id;
                                      const sessions =
                                        result.recordset[0]
                                          .trainee_unattended_sessions;
                                      const traineeTotalSessions = sessions + 1;
                                      request.input(
                                        "traineeId",
                                        sql.VarChar,
                                        traineeId
                                      );
                                      request.input(
                                        "traineeTotalSessions",
                                        sql.Int,
                                        traineeTotalSessions
                                      );
                                      request.query(
                                        "UPDATE trainee_dtls SET trainee_unattended_sessions = @traineeTotalSessions WHERE trainee_id = @traineeId",
                                        (err, response) => {
                                          if (err) {
                                            return console.log({
                                              error: err.message,
                                            });
                                          }
                                          if (response) {
                                            sgMail.setApiKey(
                                              process.env.SENDGRID_API_KEY
                                            );
                                            const msg =
                                              traineeRescheduleEmailSentTemplate(
                                                traineeEmail,
                                                traineeName,
                                                mentorName,
                                                bookingDate,
                                                slotTime,
                                                "http://localhost:3000/trainee/profile/my-sessions"
                                              );
                                            sgMail
                                              .send(msg)
                                              .then(() => {
                                                return console.log({
                                                  success:
                                                    "Successfully reschedule email sent",
                                                });
                                              })
                                              .catch((error) => {
                                                return console.log({
                                                  error: error.message,
                                                });
                                              });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}
setInterval(() => {
  checkTheDateAndStatusChangeOfTrainee();
  checkTheDateAndStatusChangeOfMentor();
  checkTheDateAndStatusChangeOfTraineeANdMentor();
}, 6000);

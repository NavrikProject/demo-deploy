import sql from "mssql";
import config from "../config/dbconfig.js";
import rescheduleEmail from "../middleware/rescheduleEmail.js";
import sgMail from "@sendgrid/mail";

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
        "select * from booking_appointments_dtls where trainee_session_status = 'upcoming' and mentor_session_status = 'attended'",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            result.recordset.forEach((recordset) => {
              const bookingAppointmentId = recordset.booking_appt_id;
              const traineeEmail = recordset.user_email;
              let previousDate = new Date();
              previousDate.setDate(previousDate.getDate() - 1);
              if (
                previousDate.toLocaleDateString() ===
                new Date(recordset.booking_mentor_date).toLocaleDateString()
              ) {
                const request = new sql.Request();
                request.input("id", sql.Int, bookingAppointmentId);
                const sqlUpdate =
                  "UPDATE booking_appointments_dtls SET trainee_session_status = 'unattended' WHERE booking_appt_id= @id ";
                request.query(sqlUpdate, (err, result) => {
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
                                const msg = rescheduleEmail(
                                  traineeEmail,
                                  "Reschedule your mentor session",
                                  "http://localhost:3000/trainee/profile/my-sessions",
                                  "Reschedule"
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
                                const msg = rescheduleEmail(
                                  traineeEmail,
                                  "Reschedule your mentor session",
                                  "http://localhost:3000/trainee/profile/my-sessions",
                                  "Reschedule"
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
        "select * from booking_appointments_dtls where mentor_session_status = 'upcoming' and trainee_session_status = 'attended' ",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            result.recordset.forEach((recordset) => {
              const bookingAppointmentId = recordset.booking_appt_id;
              const mentorEmail = recordset.mentor_email;
              let previousDate = new Date();
              previousDate.setDate(previousDate.getDate() - 1);
              if (
                previousDate.toLocaleDateString() ===
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
                                const msg = rescheduleEmail(
                                  mentorEmail,
                                  "Reschedule your mentor session",
                                  "http://localhost:3000/mentor/profile/my-sessions",
                                  "Reschedule"
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
        "select * from booking_appointments_dtls where trainee_session_status = 'upcoming' and mentor_session_status = 'upcoming'",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            result.recordset.forEach((recordset) => {
              const bookingAppointmentId = recordset.booking_appt_id;
              const traineeEmail = recordset.user_email;
              const mentorEmail = recordset.mentor_email;
              let previousDate = new Date();
              previousDate.setDate(previousDate.getDate() - 1);
              if (
                previousDate.toLocaleDateString() ===
                new Date(recordset.booking_mentor_date).toLocaleDateString()
              ) {
                const request = new sql.Request();
                request.input("id", sql.Int, bookingAppointmentId);
                const sqlUpdate =
                  "UPDATE booking_appointments_dtls SET trainee_session_status = 'unattended', mentor_session_status = 'unattended' WHERE booking_appt_id= @id ";
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
                                request.input(
                                  "traineeEmail",
                                  sql.VarChar,
                                  traineeEmail
                                );
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
                                            sgMail.setApiKey(
                                              process.env.SENDGRID_API_KEY
                                            );
                                            const msg = rescheduleEmail(
                                              traineeEmail,
                                              "Reschedule your mentor session",
                                              "http://localhost:3000/trainee/profile/my-sessions",
                                              "Reschedule"
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
                                      const traineeId =
                                        result.recordset[0].trainee_id;
                                      const sessions =
                                        result.recordset[0]
                                          .trainee_unattended_sessions;
                                      const totalSessions = sessions + 1;
                                      request.input(
                                        "traineeId",
                                        sql.VarChar,
                                        traineeId
                                      );
                                      request.query(
                                        "UPDATE trainee_dtls SET trainee_unattended_sessions = @totalSessions WHERE trainee_id = @traineeId",
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
                                            const msg = rescheduleEmail(
                                              traineeEmail,
                                              "Reschedule your mentor session",
                                              "http://localhost:3000/trainee/profile/my-sessions",
                                              "Reschedule"
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
                                                  error:
                                                    "There is some error while saving",
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
}, 60000);

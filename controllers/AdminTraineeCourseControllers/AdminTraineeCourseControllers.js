import { request } from "express";
import moment from "moment";
import sql from "mssql";
import config from "../../config/dbconfig.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import rp from "request-promise";
import schedule from "node-schedule";
import sgMail from "@sendgrid/mail";
import { traineeLiveClassRemainderEmailTemplate } from "../../middleware/traineeEmailTemplates.js";
import { instructorLiveClassRemainderEmailTemplate } from "../../middleware/trainerEmailTemplates.js";
dotenv.config();

const payload = {
  iss: process.env.ZOOM_APP_API_KEY,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_APP_API_SECRET_KEY);
export async function getTraineeInCompleteCourses(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from trainee_courses_dtls where trainee_course_progress_percentage <= '40' and trainee_course_progress_percentage > '30' or trainee_course_progress_percentage > '60' and trainee_course_progress_percentage <= '70' or trainee_course_progress_percentage = '100' or trainee_course_complete_status = 'pending' ORDER by trainee_course_dtls_id DESC",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "Not found from in complete course" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: "Not found" });
  }
}

export async function bookInstructorLiveClass(req, res) {
  const { date, startTime, traineeDtlsId, userEmail } = req.body;
  let hour = startTime?.split(":")[0];
  let minutes = startTime?.split(":")[1];
  minutes = parseInt(minutes) + 30;
  minutes = minutes.toString();
  let endTime = `${hour}:${minutes.toString()}`;
  try {
    var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    var options = {
      method: "POST",
      uri: "https://api.zoom.us/v2/users/me/meetings",
      body: {
        topic: "Instructor booking",
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
        let instructorHostUrl = response.start_url;
        let traineeJoinUrl = response.join_url;
        sql.connect(config, (err) => {
          const request = new sql.Request();
          request.query(
            "select * from instructor_live_classes_dtls where instructor_live_class_status = '7' and instructor_live_class_status = '9' and instructor_live_class_status = '11'",
            (err, result) => {
              if (err) return res.send({ error: err.message });
              if (result.recordset.length > 0) {
                return res.send({
                  error: "Instruction session has been all ready completed",
                });
              } else {
                request.input("traineeDtlsId", sql.Int, traineeDtlsId);
                request.query(
                  "select * from trainee_courses_dtls where trainee_course_dtls_id = @traineeDtlsId and trainee_course_status = '6' or trainee_course_status = '8' or trainee_course_status = '10' ",
                  (err, result) => {
                    if (err) return res.send({ error: err.message });
                    if (result.recordset.length > 0) {
                      const traineeCourseId =
                        result.recordset[0].trainee_course_id;
                      const traineeName = result.recordset[0].trainee_fullname;
                      const traineeEmail =
                        result.recordset[0].trainee_course_email;
                      const instructorName =
                        result.recordset[0].trainee_course_instructor_name;
                      const traineeCourseName =
                        result.recordset[0].trainee_course_name;
                      let liveClassStatus =
                        result.recordset[0].trainee_course_status;
                      liveClassStatus = parseInt(liveClassStatus);
                      liveClassStatus = liveClassStatus + 1;
                      request.query(
                        "insert into instructor_live_classes_dtls (trainee_course_id,trainee_fullname,trainee_email,trainee_course_name,instructor_fullname,instructor_email,instructor_live_class_date,instructor_live_class_start_time,instructor_live_class_end_time,instructor_live_class_cr_date,instructor_host_url,trainee_join_url,instructor_live_class_status) VALUES('" +
                          traineeCourseId +
                          "','" +
                          traineeName +
                          "','" +
                          traineeEmail +
                          "','" +
                          traineeCourseName +
                          "','" +
                          instructorName +
                          "','" +
                          userEmail +
                          "','" +
                          date +
                          "','" +
                          startTime +
                          "','" +
                          endTime +
                          "','" +
                          timestamp +
                          "','" +
                          instructorHostUrl +
                          "','" +
                          traineeJoinUrl +
                          "','" +
                          liveClassStatus +
                          "' )",
                        (err, success) => {
                          if (err) {
                            return res.send({ error: err.message });
                          }
                          if (success) {
                            res.send({
                              success:
                                "Live class has been scheduled successfully",
                            });
                          } else {
                            return res.send({
                              error:
                                "There was an error while scheduling the live class",
                            });
                          }
                        }
                      );
                    } else {
                      return res.send({
                        error:
                          "Sorry you can not book the instructor live class",
                      });
                    }
                  }
                );
              }
            }
          );
        });
      })
      .catch(function (err) {
        return res.send({ error: err.message });
      });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

export async function getAllBookingLiveClasses(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from instructor_live_classes_dtls where instructor_live_class_completed_status = 'pending' ORDER by instructor_live_classes_dtls_id DESC",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: " " });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: " " });
  }
}

export async function getTraineeLiveClassDetailsInAdmin(req, res) {
  const { traineeCourseId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("traineeCourseId", sql.Int, traineeCourseId);
      request.query(
        "select * from instructor_live_classes_dtls where trainee_course_id = @traineeCourseId and instructor_live_class_completed_status = 'pending' ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: " " });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: " " });
  }
}

function updateLiveInstructorClassToComplete(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from trainee_courses_dtls where trainee_course_status = '7' or trainee_course_status = '9' or trainee_course_status = '11'",
        (err, results) => {
          if (err) return console.log({ error: err.message });
          if (results?.recordset.length > 0) {
            results.recordset.forEach((result) => {
              const traineeCourseStatus = result.trainee_course_status;
              const traineeCourseId = result.trainee_course_id;
              request.input(
                "traineeCourseStatus",
                sql.Int,
                traineeCourseStatus
              );
              request.input("traineeCourseId", sql.Int, traineeCourseId);
              request.query(
                "select * from instructor_live_classes_dtls where instructor_live_class_status = @traineeCourseStatus and trainee_course_id = @traineeCourseId and instructor_live_class_completed_status = 'pending'",
                (err, result) => {
                  if (err) return console.error({ error: err.message });
                  if (result.recordset.length > 0) {
                    const liveClassDtlsId =
                      result.recordset[0].instructor_live_classes_dtls_id;
                    request.input("liveClassDtlsId", sql.Int, liveClassDtlsId);
                    request.query(
                      "update instructor_live_classes_dtls set instructor_live_class_completed_status= 'completed' where instructor_live_classes_dtls_id = @liveClassDtlsId and trainee_course_id = @traineeCourseId",
                      (err, result) => {
                        if (err) return res.send({ error: err.message });
                        if (result) {
                          return console.log(
                            "Live classes updated successfully"
                          );
                        } else {
                          return console.log("There was an error updating");
                        }
                      }
                    );
                  } else {
                    return console.error({
                      error: "Not found from live class",
                    });
                  }
                }
              );
            });
          } else {
            console.log("not found from  trainee course");
          }
        }
      );
    });
  } catch (error) {
    return console.error({ error: "Not found" });
  }
}
setInterval(() => {
  updateLiveInstructorClassToComplete();
}, 60000);

// remainder will be sent on before 10 minutes to trainee
function sentEmailLiveClassRemainderToTraineeBefore15Min(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query(
        "select * from instructor_live_classes_dtls where instructor_live_class_completed_status = 'pending'",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.trainee_email;
            let traineeJoinUrl = res.trainee_join_url;
            let instructorName = res.instructor_fullname;
            let instructorEmail = res.instructor_email;
            let instructorHostUrl = res.instructor_host_url;
            let traineeName = res.trainee_fullname;
            let slotTime =
              res.instructor_live_class_start_time +
              " to " +
              res.instructor_live_class_end_time;
            let year = new Date(res.instructor_live_class_date).getFullYear();
            let month = new Date(res.instructor_live_class_date).getMonth();
            let day = new Date(res.instructor_live_class_date).getDate();
            let hour = res.instructor_live_class_start_time.split(":")[0];
            let min = res.instructor_live_class_start_time.split(":")[1];
            if (min === "00") {
              hour = hour - 1;
              const date = new Date(year, month, day, hour, 50, 0);
              schedule.scheduleJob(date, function () {
                console.log("Entered this function");
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = traineeLiveClassRemainderEmailTemplate(
                  traineeEmail,
                  traineeName,
                  instructorName,
                  new Date(date).toDateString(),
                  slotTime,
                  "15",
                  traineeJoinUrl
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    const msg = instructorLiveClassRemainderEmailTemplate(
                      instructorEmail,
                      instructorName,
                      traineeName,
                      new Date(date).toDateString(),
                      slotTime,
                      "15",
                      instructorHostUrl
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 15 minutes");
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
function sentEmailLiveClassRemainderToTraineeBefore5Min(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query(
        "select * from instructor_live_classes_dtls where instructor_live_class_completed_status = 'pending'",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.trainee_email;
            let traineeJoinUrl = res.trainee_join_url;
            let instructorName = res.instructor_fullname;
            let instructorEmail = res.instructor_email;
            let instructorHostUrl = res.instructor_host_url;
            let traineeName = res.trainee_fullname;
            let slotTime =
              res.instructor_live_class_start_time +
              " to " +
              res.instructor_live_class_end_time;
            let year = new Date(res.instructor_live_class_date).getFullYear();
            let month = new Date(res.instructor_live_class_date).getMonth();
            let day = new Date(res.instructor_live_class_date).getDate();
            let hour = res.instructor_live_class_start_time.split(":")[0];
            let min = res.instructor_live_class_start_time.split(":")[1];
            if (min === "00") {
              hour = hour - 1;
              const date = new Date(year, month, day, hour, 55, 0);
              schedule.scheduleJob(date, function () {
                console.log("Entered this function");
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = traineeLiveClassRemainderEmailTemplate(
                  traineeEmail,
                  traineeName,
                  instructorName,
                  new Date(date).toDateString(),
                  slotTime,
                  "5",
                  traineeJoinUrl
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    const msg = instructorLiveClassRemainderEmailTemplate(
                      instructorEmail,
                      instructorName,
                      traineeName,
                      new Date(date).toDateString(),
                      slotTime,
                      "5",
                      instructorHostUrl
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email Sent before 15 minutes");
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
function sentEmailLiveClassRemainderToTraineeToStart(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query(
        "select * from instructor_live_classes_dtls where instructor_live_class_completed_status = 'pending'",
        (err, result) => {
          result?.recordset.forEach((res) => {
            let traineeEmail = res.trainee_email;
            let traineeJoinUrl = res.trainee_join_url;
            let instructorName = res.instructor_fullname;
            let instructorEmail = res.instructor_email;
            let instructorHostUrl = res.instructor_host_url;
            let traineeName = res.trainee_fullname;
            let slotTime =
              res.instructor_live_class_start_time +
              " to " +
              res.instructor_live_class_end_time;
            let year = new Date(res.instructor_live_class_date).getFullYear();
            let month = new Date(res.instructor_live_class_date).getMonth();
            let day = new Date(res.instructor_live_class_date).getDate();
            let hour = res.instructor_live_class_start_time.split(":")[0];
            let min = res.instructor_live_class_start_time.split(":")[1];
            const date = new Date(year, month, day, hour, min, 0);
            schedule.scheduleJob(date, function () {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              console.log("Entered this function");
              const msg = traineeLiveClassRemainderEmailTemplate(
                traineeEmail,
                traineeName,
                instructorName,
                new Date(date).toDateString(),
                slotTime,
                "0",
                traineeJoinUrl
              );
              sgMail
                .send(msg)
                .then(() => {
                  const msg = instructorLiveClassRemainderEmailTemplate(
                    instructorEmail,
                    instructorName,
                    traineeName,
                    new Date(date).toDateString(),
                    slotTime,
                    "0",
                    instructorHostUrl
                  );
                  sgMail
                    .send(msg)
                    .then(() => {
                      console.log("Email Sent before 0 minutes");
                    })
                    .catch((error) => {
                      console.log(error.message);
                    });
                })
                .catch((error) => {
                  console.log(error.message);
                });
            });
          });
        }
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}
sentEmailLiveClassRemainderToTraineeBefore15Min();
sentEmailLiveClassRemainderToTraineeBefore5Min();
sentEmailLiveClassRemainderToTraineeToStart();

import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import dotenv from "dotenv";
dotenv.config();
import {
  traineeFeedbackVideoUploadEmail,
  traineeMentorAttendEmailCourseComplete,
} from "../../middleware/traineeEmailTemplates.js";

export async function addTraineeCourseDetails(req, res, next) {
  const id = req.params.id;
  const { courseNameId, startsDate } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from users_dtls where user_dtls_id = @id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const fullname =
              result.recordset[0].user_firstname +
              " " +
              result.recordset[0].user_lastname;
            const userEmail = result.recordset[0].user_email;
            sql.connect(config, (err) => {
              if (err) return res.send({ error: err.message });
              const request = new sql.Request();
              request.input("courseId", sql.Int, courseNameId);
              request.query(
                "select * from courses_dtls where course_id = @courseId",
                (err, result) => {
                  if (err) return res.send(err.message);
                  if (result.recordset.length > 0) {
                    const courseId = result.recordset[0].course_id;
                    const courseName = result.recordset[0].course_name;
                    const courseCategory = result.recordset[0].course_category;
                    const instructorName =
                      result.recordset[0].course_trainer_name;
                    sql.connect(config, (err) => {
                      if (err) res.send({ error: err.message });
                      const request = new sql.Request();
                      request.input(
                        "traineeCourseName",
                        sql.VarChar,
                        courseName
                      );
                      request.input("traineeCourseId", sql.Int, courseId);
                      request.query(
                        "select * from trainee_courses_dtls where trainee_course_name = @traineeCourseName and trainee_course_id = @traineeCourseId",
                        (err, result) => {
                          if (err) return res.send({ error: err.message });
                          if (result.recordset.length > 0) {
                            return res.send({
                              error:
                                "Trainee course all ready added to the report",
                            });
                          } else {
                            sql.connect(config, (err) => {
                              if (err) return res.send(err.message);
                              const request = new sql.Request();
                              request.query(
                                "insert into trainee_courses_dtls (trainee_course_id,trainee_course_email,trainee_fullname,trainee_course_category,trainee_course_name,trainee_course_instructor_name,trainee_course_start_date) VALUES('" +
                                  courseId +
                                  "','" +
                                  userEmail +
                                  "','" +
                                  fullname +
                                  "','" +
                                  courseCategory +
                                  "','" +
                                  courseName +
                                  "','" +
                                  instructorName +
                                  "', '" +
                                  new Date(startsDate)
                                    .toISOString()
                                    .substring(0, 10) +
                                  "')",
                                (err, success) => {
                                  if (err) {
                                    return res.send({ error: err.message });
                                  }
                                  if (success) {
                                    return res.send({
                                      success:
                                        "Successfully submitted the trainee progress report",
                                    });
                                  } else {
                                    return res.send({
                                      error:
                                        "There was an error submitting the trainee progress report",
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
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {}
}

export async function getAllTraineeProgress(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ err: err.message });
      const request = new sql.Request();
      request.query(
        "select * from trainee_courses_dtls ORDER BY trainee_course_dtls_id DESC",
        (err, result) => {
          if (err) return res.send({ err: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {}
}

export async function getCoursesByCategory(req, res) {
  const category = req.query.name;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("category", sql.VarChar, category);
      request.query(
        "select * from courses_dtls where course_category = @category",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {}
}

export async function updateTraineeCourseProgress(req, res, next) {
  const id = req.params.id;
  let endDate = req.body.endDate;
  const {
    coursePercentage,
    courseChapters,
    courseProgressStatus,
    courseVideoUploadStatus,
    courseCompletedStatus,
  } = req.body;
  if (endDate) {
    endDate = new Date(endDate).toISOString().substring(0, 10);
  }
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from trainee_courses_dtls where trainee_course_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
            request.input("traineeCourseId", sql.Int, id);
            request.input("coursePercentage", sql.Int, coursePercentage);
            request.input("courseChapters", sql.Int, courseChapters);
            request.input(
              "courseProgressStatus",
              sql.VarChar,
              courseProgressStatus
            );
            request.input("date", sql.DateTime2, timestamp);

            request.input(
              "courseCompletedStatus",
              sql.VarChar,
              courseCompletedStatus
            );
            if (!endDate) {
              const sqlUpdate =
                "UPDATE trainee_courses_dtls SET trainee_course_progress_status = @courseProgressStatus,trainee_course_progress_percentage = @coursePercentage, trainee_course_chapter_completed = @courseChapters, trainee_course_chapter_complete_status_dt = @date,trainee_course_status= @courseCompletedStatus WHERE trainee_course_dtls_id = @traineeCourseId";
              request.query(sqlUpdate, (err, result) => {
                if (err)
                  return res.send({
                    error: err.message,
                  });
                if (result) {
                  return res.send({
                    success:
                      "Successfully updated the trainee course progress status",
                  });
                } else {
                  return res.send({
                    error:
                      "There was an error updating the trainee course progress status",
                  });
                }
              });
            } else {
              request.input("endDate", sql.Date, endDate);
              const sqlUpdate =
                "UPDATE trainee_courses_dtls SET trainee_course_progress_status = @courseProgressStatus,trainee_course_progress_percentage = @coursePercentage, trainee_course_chapter_completed = @courseChapters, trainee_course_chapter_complete_status_dt = @date, trainee_course_end_date= @endDate, trainee_course_status= @courseCompletedStatus WHERE trainee_course_dtls_id = @traineeCourseId";
              request.query(sqlUpdate, (err, result) => {
                if (err)
                  return res.send({
                    error: err.message,
                  });
                if (result) {
                  return res.send({
                    success:
                      "Successfully updated the trainee course progress status",
                  });
                } else {
                  return res.send({
                    error:
                      "There was an error updating the trainee course progress status",
                  });
                }
              });
            }
          } else {
            return res.send({ error: "Not found the trainee course details." });
          }
        }
      );
    });
  } catch (error) {
    return res.send({
      error: "There was an error updating the trainee course progress status",
    });
  }
}

export async function getTraineeCourseStatus(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ err: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from trainee_courses_dtls where trainee_course_dtls_id = @id ",
        (err, result) => {
          if (err) return res.send({ err: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "" });
          }
        }
      );
    });
  } catch (error) {}
}

export async function updateTraineeCourseVideoUpload(req, res, next) {
  const id = req.params.id;
  const { courseVideoUploadStatus } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from trainee_courses_dtls where trainee_course_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("traineeCourseId", sql.Int, id);
            request.input(
              "courseVideoUploadStatus",
              sql.VarChar,
              courseVideoUploadStatus
            );
            const sqlUpdate =
              "UPDATE trainee_courses_dtls SET trainee_course_video_upload_status = @courseVideoUploadStatus WHERE trainee_course_dtls_id = @traineeCourseId";
            request.query(sqlUpdate, (err, result) => {
              if (err)
                return res.send({
                  error: err.message,
                });
              if (result) {
                return res.send({
                  success:
                    "Successfully updated the trainee video progress status",
                });
              } else {
                return res.send({
                  error:
                    "There was an error updating the trainee course progress status",
                });
              }
            });
          } else {
            return res.send({ error: "Not found the trainee course details." });
          }
        }
      );
    });
  } catch (error) {
    return res.send({
      error: "There was an error updating the trainee course progress status",
    });
  }
}

function sendFeedBackUploadEmailToTrainee(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      request.query(
        "select * from trainee_courses_dtls where trainee_course_progress_status = 'completed' and trainee_course_status = 'completed' and trainee_course_progress_percentage = 100 and trainee_course_video_upload_email = 'no' ",
        (err, results) => {
          if (err) return console.log(err.message);
          if (results.recordset.length > 0) {
            results?.recordset?.forEach((recordset) => {
              const traineeCourseId = recordset.trainee_course_dtls_id;
              const traineeEmail = recordset.trainee_course_email;
              const traineeName = recordset.trainee_fullname;
              const traineeCourse = recordset.trainee_course_name;
              sql.connect(config, (err) => {
                if (err) return console.log(err.message);
                const request = new sql.Request();
                request.input("id", sql.Int, traineeCourseId);
                const emailSent = "yes";
                request.input("email", sql.VarChar, emailSent);
                const sqlUpdate =
                  "UPDATE trainee_courses_dtls SET trainee_course_video_upload_email = @email WHERE trainee_course_dtls_id = @id";
                request.query(sqlUpdate, (err, result) => {
                  if (err)
                    return console.log({
                      error: err.message,
                    });
                  if (result) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeFeedbackVideoUploadEmail(
                      traineeEmail,
                      traineeName,
                      traineeCourse
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        return console.log({
                          success: "Successfully email sent to the user",
                        });
                      })
                      .catch((error) => {
                        console.error(error.message);
                      });
                  } else {
                    return console.log({
                      error: "There was an error sending the email",
                    });
                  }
                });
              });
            });
          }
        }
      );
    });
  } catch (error) {
    return console.log(error.message);
  }
}

function sendMentorEmailToTrainee(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      request.query(
        "select * from trainee_courses_dtls where trainee_course_progress_status = 'completed' and trainee_course_status = 'completed' and trainee_course_progress_percentage = 100 and trainee_course_video_upload_email = 'yes' and  trainee_course_video_upload_status = 'uploaded' and trainee_course_mentor_session_email = 'no' ",
        (err, results) => {
          if (err) return console.log(err.message);
          if (results.recordset.length > 0) {
            results?.recordset?.forEach((recordset) => {
              const traineeCourseId = recordset.trainee_course_dtls_id;
              const traineeEmail = recordset.trainee_course_email;
              const traineeName = recordset.trainee_fullname;
              const traineeCourse = recordset.trainee_course_name;
              sql.connect(config, (err) => {
                if (err) return console.log(err.message);
                const request = new sql.Request();
                request.input("id", sql.Int, traineeCourseId);
                const emailSent = "yes";
                request.input("email", sql.VarChar, emailSent);
                const sqlUpdate =
                  "UPDATE trainee_courses_dtls SET trainee_course_mentor_session_email = @email WHERE trainee_course_dtls_id = @id";
                request.query(sqlUpdate, (err, result) => {
                  if (err)
                    return console.log({
                      error: err.message,
                    });
                  if (result) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeMentorAttendEmailCourseComplete(
                      traineeEmail,
                      traineeName,
                      traineeCourse
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        return console.log({
                          success: "Successfully email sent to the user",
                        });
                      })
                      .catch((error) => {
                        console.error(error.message);
                      });
                  } else {
                    return console.log({
                      error: "There was an error sending the email",
                    });
                  }
                });
              });
            });
          }
        }
      );
    });
  } catch (error) {
    return console.log(error.message);
  }
}

function addTraineeCoursePoints(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return console.log(err.message);
      const request = new sql.Request();
      request.query(
        "select * from trainee_courses_dtls where trainee_course_progress_status = 'completed' and trainee_course_status = 'completed' and trainee_course_progress_percentage = 100 and trainee_course_video_upload_email = 'yes' and  trainee_course_video_upload_status = 'uploaded' and trainee_course_mentor_session_email = 'yes' and trainee_course_reward_points_status = 'no' ",
        (err, results) => {
          if (err) return console.log(err.message);
          if (results.recordset.length > 0) {
            results?.recordset?.forEach((recordset) => {
              const traineeCourseDtlsId = recordset.trainee_course_dtls_id;
              const traineeEmail = recordset.trainee_course_email;
              const traineeName = recordset.trainee_fullname;
              request.input("traineeEmail", sql.VarChar, traineeEmail);
              request.query(
                "select * from user_points_dtls where user_points_dtls_email = @traineeEmail",
                (err, result) => {
                  if (err) return console.log(err.message);
                  if (result.recordset.length > 0) {
                    const previousRewardPoints =
                      result.recordset[0].user_points_dtls_closing_points;
                    const currentPoints = 100;
                    const totalRewardPoints =
                      previousRewardPoints + currentPoints;
                    request.input(
                      "previousRewardPoints",
                      sql.Int,
                      previousRewardPoints
                    );
                    request.input(
                      "totalRewardPoints",
                      sql.Int,
                      totalRewardPoints
                    );
                    const sqlUpdate =
                      "UPDATE user_points_dtls SET user_points_dtls_closing_points = @totalRewardPoints,user_points_dtls_last_points = @previousRewardPoints WHERE user_points_dtls_email = @traineeEmail";
                    request.query(sqlUpdate, (err, result) => {
                      if (err)
                        return console.log({
                          error: err.message,
                        });
                      if (result) {
                        sql.connect(config, (err) => {
                          if (err) return console.log(err.message);
                          const request = new sql.Request();
                          request.input(
                            "traineeCourseDtlsId",
                            sql.Int,
                            traineeCourseDtlsId
                          );
                          const emailSent = "yes";
                          request.input("email", sql.VarChar, emailSent);
                          const sqlUpdate =
                            "UPDATE trainee_courses_dtls SET trainee_course_reward_points_status = @email WHERE trainee_course_dtls_id = @traineeCourseDtlsId";
                          request.query(sqlUpdate, (err, result) => {
                            if (err)
                              return console.log({
                                error: err.message,
                              });
                            if (result) {
                              return console.log({
                                success: "Updated successfully",
                              });
                            } else {
                              return console.log({
                                error: "There was an error sending the email",
                              });
                            }
                          });
                        });
                      } else {
                        return res.send({
                          error: "There was an error while updating the points",
                        });
                      }
                    });
                  }
                  if (result.recordset.length === 0) {
                    const lastPoints = 100;
                    var timestamp = moment(Date.now()).format(
                      "YYYY-MM-DD HH:mm:ss"
                    );
                    request.query(
                      "insert into user_points_dtls (user_points_dtls_email,user_points_dtls_fullname,user_points_dtls_role,user_points_dtls_last_points,user_points_dtls_closing_points,user_points_dtls_cr_date) VALUES('" +
                        traineeEmail +
                        "','" +
                        traineeName +
                        "','" +
                        "trainee" +
                        "','" +
                        lastPoints +
                        "','" +
                        lastPoints +
                        "','" +
                        timestamp +
                        "' )",
                      (err, success) => {
                        if (err) {
                          return console.log({ error: err.message });
                        }
                        if (success) {
                          sql.connect(config, (err) => {
                            if (err) return console.log(err.message);
                            const request = new sql.Request();
                            request.input(
                              "traineeCourseDtlsId",
                              sql.Int,
                              traineeCourseDtlsId
                            );
                            const emailSent = "yes";
                            request.input("email", sql.VarChar, emailSent);
                            const sqlUpdate =
                              "UPDATE trainee_courses_dtls SET trainee_course_reward_points_status = @email WHERE trainee_course_dtls_id = @traineeCourseDtlsId";
                            request.query(sqlUpdate, (err, result) => {
                              if (err)
                                return console.log({
                                  error: err.message,
                                });
                              if (result) {
                                return console.log({
                                  success: "Updated successfully",
                                });
                              } else {
                                return console.log({
                                  error: "There was an error sending the email",
                                });
                              }
                            });
                          });
                        } else {
                          return console.log({
                            error:
                              "There was an error while updating the points",
                          });
                        }
                      }
                    );
                  }
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {
    return console.log({
      error: "There was an error while updating the points",
    });
  }
}

setInterval(() => {
  sendFeedBackUploadEmailToTrainee();
  sendMentorEmailToTrainee();
  addTraineeCoursePoints();
  console.log("Logging for every 10 minutes");
}, 60000);

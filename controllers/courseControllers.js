import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import updateEmail from "../middleware/updateEmail.js";

export async function getCourseController(req, res, next) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "SELECT * FROM courses_dtls WHERE course_id = @id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

export function allCourseControllers(req, res, next) {
  const qCategory = req.query.category;
  try {
    if (qCategory) {
      sql.connect(config, (err) => {
        const request = new sql.Request();
        request.input("category", sql.VarChar, qCategory);
        request.query(
          "SELECT * FROM courses_dtls WHERE course_category = @category",
          (err, result) => {
            if (err) return res.send(err.message);
            if (result.recordset.length > 0) {
              return res.send(result.recordset);
            } else {
              return;
            }
          }
        );
      });
    } else {
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.query("select * from courses_dtls", (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
          }
        });
      });
    }
  } catch (error) {
    res.send(error.message);
  }
}

export function getCourseByCategoryDomain(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const category = "domain";
      request.input("category", sql.VarChar, category);
      request.query(
        "select * from courses_dtls where course_category = @category ",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}
export function getCourseByCategoryItSkills(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const category = "it-skills";
      request.input("category", sql.VarChar, category);
      request.query(
        "select * from courses_dtls where course_category = @category ",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

export function getCourseByCategorySoftware(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      const category = "software-development";
      request.input("category", sql.VarChar, category);
      request.query(
        "select * from courses_dtls where course_category = @category ",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

export function getCourseBySearch(req, res) {
  const query = req.query.name;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("search", sql.VarChar, query);
      request.query(
        "SELECT * FROM courses_dtls WHERE course_name = @search ",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
            // res.send("No course found with this category");
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

export function getMasterCourseByTitles(req, res) {
  const query = req.query.category;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("query", sql.VarChar, query);
      request.query(
        "select * from course_master WHERE course_master_cat_name = @query ",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ master: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

export function addJoinNowCourse(req, res) {
  const {
    email,
    firstName,
    lastName,
    mobileNumber,
    experience,
    masterCourseNameId,
    qualification,
    prefTime,
    noOfHrs,
    engType,
    skills,
  } = req.body;
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.input("masterCourseNameId", sql.VarChar, masterCourseNameId);
      request.query(
        "select * from course_master WHERE course_master_name_id= @masterCourseNameId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const masterCourseId = result.recordset[0].course_master_name_id;
            sql.connect(config, (err) => {
              const request = new sql.Request();
              request.input("masterCourseId", sql.Int, masterCourseId);
              request.input("email", sql.VarChar, email);
              request.query(
                "select * from trainer_details_approve WHERE  trainer_email = @email AND trainer_course_id = @masterCourseId ",
                (err, result) => {
                  if (err) return res.send(err.message);
                  if (result.recordset.length > 0) {
                    let courseId = result.recordset[0].trainer_course_id;
                    if (masterCourseId === courseId) {
                      res.send({
                        error:
                          "You have all ready applied for this course wait for the verification to complete",
                      });
                    }
                  } else {
                    sql.connect(config, (err) => {
                      const request = new sql.Request();
                      request.input(
                        "masterCourseNameId",
                        sql.VarChar,
                        masterCourseNameId
                      );
                      request.query(
                        "select * from course_master WHERE course_master_name_id= @masterCourseNameId",
                        (err, result) => {
                          if (err) return res.send(err.message);
                          if (result.recordset.length > 0) {
                            const courseCatId =
                              result.recordset[0].course_master_cat_id;
                            let mysqlTimestamp = moment(Date.now()).format(
                              "YYYY-MM-DD HH:mm:ss"
                            );
                            sql.connect(config, (err) => {
                              if (err) return res.send(err.message);
                              const request = new sql.Request();
                              request.query(
                                "insert into trainer_details_approve (trainer_email,trainer_firstname,trainer_lastname,trainer_mobile,trainer_qualifications,trainer_skills,trainer_exp_yrs,trainer_pref_time,trainer_engment_typ,trainer_no_of_hrs_daily,trainer_creation_date,trainer_course_id,trainer_course_cat_id) VALUES('" +
                                  email +
                                  "','" +
                                  firstName +
                                  "','" +
                                  lastName +
                                  "','" +
                                  mobileNumber +
                                  "','" +
                                  qualification +
                                  "', '" +
                                  skills +
                                  "','" +
                                  experience +
                                  "', '" +
                                  prefTime +
                                  "','" +
                                  engType +
                                  "','" +
                                  noOfHrs +
                                  "','" +
                                  mysqlTimestamp +
                                  "','" +
                                  masterCourseNameId +
                                  "','" +
                                  courseCatId +
                                  "')",
                                (err, success) => {
                                  if (err) {
                                    console.log(err.message);
                                  }
                                  if (success) {
                                    sgMail.setApiKey(
                                      process.env.SENDGRID_API_KEY
                                    );

                                    const msg = updateEmail(
                                      email,
                                      "Application Submitted successfully",
                                      "Submitted the application, Wait for the application need to be approved."
                                    );
                                    sgMail
                                      .send(msg)
                                      .then(() => {
                                        res.send({
                                          success:
                                            "Successfully submitted the form ,Wait for the approval process from the admin",
                                        });
                                      })
                                      .catch((error) => {
                                        console.error(error);
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
          } else {
            res.send("No course found in the master table");
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

export function getCourseBySearchInAllCourses(req, res) {
  let search = req.query.search;
  search = "%search%";
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("search", sql.VarChar, search);
      request.query(
        "SELECT * FROM courses_dtls WHERE course_name LIKE = @search OR course_title Like = @search OR course_tags LIKE = @search",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

export function getCourseByCategory(req, res) {
  const query = req.query.category;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("query", sql.VarChar, query);
      request.query(
        "SELECT * FROM courses_dtls WHERE course_category = @query ",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send(error.message);
  }
}

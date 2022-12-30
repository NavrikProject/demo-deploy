import sql from "mssql";
import config from "../../config/dbconfig.js";
import moment from "moment";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { BlockBlobClient } from "@azure/storage-blob";
import intoStream from "into-stream";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import { jobApplicationAppliedEmail } from "../../middleware/jobPostEmailTemplate.js";

// working
export async function applyForJobPost(req, res, next) {
  const jobPostUniqueId = req.params.id;
  const {
    fullname,
    currency,
    location,
    city,
    state,
    country,
    collegeName,
    universityName,
    startingYear,
    endingYear,
    completedYear,
    percentage,
    currentCompanyName,
    currentDesignation,
    currentCompanySalary,
    expectedSalary,
    companyLocation,
    companyCity,
    companyState,
    companyCountry,
    experience,
    jobPostDtlsId,
    hiringCompanyDtlsId,
    userDtlsId,
    jobSeekerEmail,
    jobRole,
    phoneNumber,
    haveExperience,
    selectedOption,
  } = req.body;

  var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const skillsSet = [];
  const loopOptions = () => {
    JSON.parse(selectedOption)?.forEach((element) => {
      skillsSet.push(element.value);
    });
  };
  loopOptions();
  try {
    const blobName = new Date().getTime() + "-" + req.files.image.name;
    const filename = `https://navrikimages.blob.core.windows.net/practiwizcontainer/jobseekerresumes/${blobName}`;
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      "practiwizcontainer/jobseekerresumes",
      blobName
    );
    const stream = intoStream(req.files.image.data);
    const streamLength = req.files.image.data.length;
    blobService
      .uploadStream(stream, streamLength)
      .then((response) => {
        sql.connect(config, (err) => {
          if (err) return res.send({ error: err.message });
          const request = new sql.Request();
          request.input("uniqueId", sql.VarChar, jobPostUniqueId);
          request.input("email", sql.VarChar, jobSeekerEmail);
          request.query(
            "select * from job_post_master where apply_job_master_unique_id = @uniqueId and apply_job_master_email = @email ",
            (err, result) => {
              if (err) return res.send({ error: err.message });
              if (result.recordset.length > 0) {
                return res.send({
                  error: "You have all ready applied for this job",
                });
              } else {
                request.query(
                  "insert into job_post_master (apply_job_master_post_dtls_id,apply_job_master_unique_id,apply_job_master_hiring_company_dtls_id,apply_job_master_user_dtls_id,apply_job_master_fullname,apply_job_master_email,apply_job_master_phone_number,apply_job_master_post_role,apply_job_master_resume,apply_job_master_cr_dt) VALUES('" +
                    jobPostDtlsId +
                    "','" +
                    jobPostUniqueId +
                    "','" +
                    hiringCompanyDtlsId +
                    "','" +
                    userDtlsId +
                    "','" +
                    fullname +
                    "','" +
                    jobSeekerEmail +
                    "','" +
                    phoneNumber +
                    "','" +
                    jobRole +
                    "','" +
                    filename +
                    "','" +
                    timestamp +
                    "' )",
                  (err, success) => {
                    if (err) {
                      return res.send({ error: err.message });
                    }
                    if (success) {
                      request.query(
                        "insert into job_seeker_profile (job_seeker_user_dtls_id,job_seeker_profile_email,job_seeker_profile_fullname,job_seeker_profile_phone_number,job_seeker_profile_currency,job_seeker_profile_location,job_seeker_profile_city,job_seeker_profile_state,job_seeker_profile_country,job_seeker_profile_cr_dt) VALUES('" +
                          userDtlsId +
                          "','" +
                          jobSeekerEmail +
                          "','" +
                          fullname +
                          "','" +
                          phoneNumber +
                          "','" +
                          currency +
                          "','" +
                          location +
                          "','" +
                          city +
                          "','" +
                          state +
                          "','" +
                          country +
                          "','" +
                          timestamp +
                          "' )",
                        (err, success) => {
                          if (err) {
                            return res.send({ error: err.message });
                          }
                          if (success) {
                            request.query(
                              "insert into job_seeker_edu_dtls (job_seeker_user_dtls_id,job_seeker_edu_dtls_email,job_seeker_edu_dtls_college,job_seeker_edu_dtls_university,job_seeker_edu_starts_year,job_seeker_edu_end_year,job_seeker_edu_completion_dt,job_seeker_edu_percentage,job_seeker_edu_skills,job_seeker_edu_resume,job_seeker_edu_cr_dt) VALUES('" +
                                userDtlsId +
                                "','" +
                                jobSeekerEmail +
                                "','" +
                                collegeName +
                                "','" +
                                universityName +
                                "','" +
                                startingYear +
                                "','" +
                                endingYear +
                                "','" +
                                completedYear +
                                "','" +
                                percentage +
                                "','" +
                                skillsSet +
                                "','" +
                                filename +
                                "','" +
                                timestamp +
                                "' )",
                              (err, success) => {
                                if (err) {
                                  return res.send({ error: err.message });
                                }
                                if (success) {
                                  if (haveExperience === "yes") {
                                    request.query(
                                      "insert into job_seeker_exp_dtls (job_seeker_exp_user_dtls_id,job_seeker_exp_dtls_email,job_seeker_exp_company_name,job_seeker_exp_job_role,job_seeker_exp_years,job_seeker_exp_current_salary,job_seeker_exp_expected_salary,job_seeker_exp_company_location,job_seeker_exp_company_city,job_seeker_exp_company_state,job_seeker_exp_company_country,job_seeker_exp_cr_dt) VALUES('" +
                                        userDtlsId +
                                        "','" +
                                        jobSeekerEmail +
                                        "','" +
                                        currentCompanyName +
                                        "','" +
                                        currentDesignation +
                                        "','" +
                                        experience +
                                        "','" +
                                        currentCompanySalary +
                                        "','" +
                                        expectedSalary +
                                        "','" +
                                        companyLocation +
                                        "','" +
                                        companyCity +
                                        "','" +
                                        companyState +
                                        "','" +
                                        companyCountry +
                                        "','" +
                                        timestamp +
                                        "' )",
                                      (err, success) => {
                                        if (err) {
                                          return res.send({
                                            error: err.message,
                                          });
                                        }
                                        if (success) {
                                          const msg =
                                            jobApplicationAppliedEmail(
                                              jobSeekerEmail,
                                              fullname,
                                              jobRole
                                            );
                                          sgMail
                                            .send(msg)
                                            .then(() => {
                                              return res.send({
                                                success:
                                                  "Successfully applied to the job",
                                              });
                                            })
                                            .catch((error) => {
                                              return res.send({
                                                error:
                                                  "There is some error while applying the job",
                                              });
                                            });
                                        } else {
                                          return res.send({
                                            error:
                                              "There was an error while applying for the job",
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    const msg = jobApplicationAppliedEmail(
                                      jobSeekerEmail,
                                      fullname,
                                      jobRole
                                    );
                                    sgMail
                                      .send(msg)
                                      .then(() => {
                                        return res.send({
                                          success:
                                            "Successfully applied to the job",
                                        });
                                      })
                                      .catch((error) => {
                                        return res.send({
                                          error:
                                            "There is some error while applying the job",
                                        });
                                      });
                                  }
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
                                "There was an error while scheduling the live class",
                            });
                          }
                        }
                      );
                    } else {
                      return res.send({
                        error:
                          "There was an error while scheduling the live class",
                      });
                    }
                  }
                );
              }
            }
          );
        });
      })
      .catch((err) => {
        return res.send({ error: "There was an error uploading" });
      });
  } catch (error) {
    res.send({ error: error.message });
  }
}
// working
export async function applyJobWithExpDetails(req, res, next) {
  const jobPostUniqueId = req.params.id;
  const {
    currentCompanyName,
    currentDesignation,
    currentCompanySalary,
    expectedSalary,
    companyLocation,
    companyCity,
    companyState,
    companyCountry,
    experience,
  } = req.body.data;
  const {
    jobPostDtlsId,
    hiringCompanyDtlsId,
    userDtlsId,
    jobSeekerEmail,
    haveExperience,
    jobRole,
  } = req.body;
  var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("uniqueId", sql.VarChar, jobPostUniqueId);
      request.input("email", sql.VarChar, jobSeekerEmail);
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select * from job_post_master where apply_job_master_unique_id = @uniqueId and apply_job_master_email = @email ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({
              error: "You have all ready applied for this job",
            });
          } else {
            request.query(
              "select a.job_seeker_profile_phone_number, a.job_seeker_profile_fullname, b.job_seeker_edu_resume from job_seeker_profile a, job_seeker_edu_dtls b where a.job_seeker_profile_email=b.job_seeker_edu_dtls_email and a.job_seeker_profile_email= @email ",
              (err, result) => {
                if (err) return res.send({ error: err.message });
                if (result) {
                  const phoneNumber =
                    result.recordset[0].job_seeker_profile_phone_number;
                  const resumeUrl = result.recordset[0].job_seeker_edu_resume;
                  const fullname =
                    result.recordset[0].job_seeker_profile_fullname;
                  request.query(
                    "insert into job_post_master (apply_job_master_post_dtls_id,apply_job_master_unique_id,apply_job_master_hiring_company_dtls_id,apply_job_master_user_dtls_id,apply_job_master_fullname,apply_job_master_email,apply_job_master_phone_number,apply_job_master_post_role,apply_job_master_resume,apply_job_master_cr_dt) VALUES('" +
                      jobPostDtlsId +
                      "','" +
                      jobPostUniqueId +
                      "','" +
                      hiringCompanyDtlsId +
                      "','" +
                      userDtlsId +
                      "','" +
                      fullname +
                      "','" +
                      jobSeekerEmail +
                      "','" +
                      phoneNumber +
                      "','" +
                      jobRole +
                      "','" +
                      resumeUrl +
                      "','" +
                      timestamp +
                      "' )",
                    (err, success) => {
                      if (err) {
                        return res.send({ error: err.message });
                      }
                      if (success) {
                        if (haveExperience === "yes") {
                          request.query(
                            "insert into job_seeker_exp_dtls (job_seeker_exp_user_dtls_id,job_seeker_exp_dtls_email,job_seeker_exp_company_name,job_seeker_exp_job_role,job_seeker_exp_years,job_seeker_exp_current_salary,job_seeker_exp_expected_salary,job_seeker_exp_company_location,job_seeker_exp_company_city,job_seeker_exp_company_state,job_seeker_exp_company_country,job_seeker_exp_cr_dt) VALUES('" +
                              userDtlsId +
                              "','" +
                              jobSeekerEmail +
                              "','" +
                              currentCompanyName +
                              "','" +
                              currentDesignation +
                              "','" +
                              experience +
                              "','" +
                              currentCompanySalary +
                              "','" +
                              expectedSalary +
                              "','" +
                              companyLocation +
                              "','" +
                              companyCity +
                              "','" +
                              companyState +
                              "','" +
                              companyCountry +
                              "','" +
                              timestamp +
                              "' )",
                            (err, success) => {
                              if (err) {
                                return res.send({ error: err.message });
                              }
                              if (success) {
                                const msg = jobApplicationAppliedEmail(
                                  jobSeekerEmail,
                                  fullname,
                                  jobRole
                                );
                                sgMail
                                  .send(msg)
                                  .then(() => {
                                    return res.send({
                                      success:
                                        "Successfully applied to the job",
                                    });
                                  })
                                  .catch((error) => {
                                    return res.send({
                                      error: error.message,
                                    });
                                  });
                              } else {
                                return res.send({
                                  error: err.message,
                                });
                              }
                            }
                          );
                        } else {
                          const msg = jobApplicationAppliedEmail(
                            jobSeekerEmail,
                            fullname,
                            jobRole
                          );
                          sgMail
                            .send(msg)
                            .then(() => {
                              return res.send({
                                success: "Successfully applied to the job",
                              });
                            })
                            .catch((error) => {
                              return res.send({
                                error: error.message,
                              });
                            });
                        }
                      } else {
                        return res.send({
                          error: err.message,
                        });
                      }
                    }
                  );
                } else {
                  return res.send({
                    error: err.message,
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}
// working for no condition need to check the yes condition
export async function applyJobWithUpdateJobPost(req, res, next) {
  const jobPostUniqueId = req.params.id;
  const {
    fullname,
    currency,
    location,
    city,
    state,
    country,
    collegeName,
    universityName,
    startingYear,
    endingYear,
    completedYear,
    percentage,
    currentCompanyName,
    currentDesignation,
    currentCompanySalary,
    expectedSalary,
    companyLocation,
    companyCity,
    companyState,
    companyCountry,
    experience,
    jobPostDtlsId,
    hiringCompanyDtlsId,
    userDtlsId,
    jobSeekerEmail,
    phoneNumber,
    haveExperience,
    selectedOption,
    showUpdate,
    jobRole,
  } = req.body;
  var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  let skillsSet = [];
  const loopOptions = () => {
    JSON.parse(selectedOption)?.forEach((element) => {
      skillsSet.push(element.value);
    });
  };
  loopOptions();
  let skillsStringSet = skillsSet.toString();
  const blobName = new Date().getTime() + "-" + req.files.image.name;
  const filename = `https://navrikimages.blob.core.windows.net/practiwizcontainer/jobseekerresumes/${blobName}`;
  const blobService = new BlockBlobClient(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    "practiwizcontainer/jobseekerresumes",
    blobName
  );
  const stream = intoStream(req.files.image.data);
  const streamLength = req.files.image.data.length;
  blobService
    .uploadStream(stream, streamLength)
    .then((response) => {
      sql.connect(config, (err) => {
        if (err) return res.send({ error: err.message });
        const request = new sql.Request();
        request.input("uniqueId", sql.VarChar, jobPostUniqueId);
        request.input("jobSeekerEmail", sql.VarChar, jobSeekerEmail);
        request.input("userDtlsId", sql.Int, userDtlsId);

        request.input("fullname", sql.VarChar, fullname);
        request.input("phoneNumber", sql.VarChar, phoneNumber);
        request.input("currency", sql.VarChar, currency);
        request.input("location", sql.VarChar, location);
        request.input("state", sql.VarChar, state);
        request.input("city", sql.VarChar, city);
        request.input("country", sql.VarChar, country);
        request.input("timestamp", sql.DateTime2, timestamp);

        request.input("collegeName", sql.VarChar, collegeName);
        request.input("universityName", sql.VarChar, universityName);
        request.input("startingYear", sql.VarChar, startingYear);
        request.input("endingYear", sql.VarChar, endingYear);
        request.input("completedYear", sql.Date, completedYear);
        request.input("percentage", sql.VarChar, percentage);
        request.input("filename", sql.Text, filename);
        request.input("skillsStringSet", sql.Text, skillsStringSet);

        request.input("currentCompanyName", sql.VarChar, currentCompanyName);
        request.input("currentDesignation", sql.VarChar, currentDesignation);
        request.input(
          "currentCompanySalary",
          sql.VarChar,
          currentCompanySalary
        );
        request.input("expectedSalary", sql.VarChar, expectedSalary);
        request.input("companyLocation", sql.VarChar, companyLocation);
        request.input("companyState", sql.VarChar, companyState);
        request.input("experience", sql.Int, experience);
        request.input("companyCity", sql.VarChar, companyCity);
        request.input("companyCountry", sql.VarChar, companyCountry);

        request.query(
          "select * from job_post_master where apply_job_master_unique_id = @uniqueId and apply_job_master_email = @jobSeekerEmail ",
          (err, result) => {
            if (err) return res.send({ error: err.message });
            if (result.recordset.length > 0) {
              return res.send({
                error: "You have all ready applied for this job",
              });
            } else {
              request.query(
                "select a.job_seeker_profile_phone_number, a.job_seeker_profile_fullname, b.job_seeker_edu_resume from job_seeker_profile a, job_seeker_edu_dtls b where a.job_seeker_profile_email=b.job_seeker_edu_dtls_email and a.job_seeker_profile_email = @jobSeekerEmail ",
                (err, result) => {
                  if (err) return res.send({ error: err.message });
                  if (result) {
                    const phoneNumber =
                      result.recordset[0].job_seeker_profile_phone_number;
                    const fullname =
                      result.recordset[0].job_seeker_profile_fullname;
                    request.query(
                      "insert into job_post_master (apply_job_master_post_dtls_id,apply_job_master_unique_id,apply_job_master_hiring_company_dtls_id,apply_job_master_user_dtls_id,apply_job_master_fullname,apply_job_master_email,apply_job_master_phone_number,apply_job_master_post_role,apply_job_master_resume,apply_job_master_cr_dt) VALUES('" +
                        jobPostDtlsId +
                        "','" +
                        jobPostUniqueId +
                        "','" +
                        hiringCompanyDtlsId +
                        "','" +
                        userDtlsId +
                        "','" +
                        fullname +
                        "','" +
                        jobSeekerEmail +
                        "','" +
                        phoneNumber +
                        "','" +
                        jobRole +
                        "','" +
                        filename +
                        "','" +
                        timestamp +
                        "' )",
                      (err, success) => {
                        if (err) {
                          return res.send({ error: err.message });
                        }
                        if (success) {
                          if (showUpdate === "yes") {
                            const sqlProfileUpdate =
                              "UPDATE job_seeker_profile SET job_seeker_profile_fullname = @fullname, job_seeker_profile_phone_number = @phoneNumber,job_seeker_profile_currency = @currency,job_seeker_profile_location = @location,job_seeker_profile_city = @city,job_seeker_profile_state = @state,job_seeker_profile_country = @country,job_seeker_profile_cr_dt = @timeStamp WHERE job_seeker_user_dtls_id = @userDtlsId and job_seeker_profile_email = @jobSeekerEmail";
                            request.query(sqlProfileUpdate, (err, result) => {
                              if (err) return res.send({ error: err.message });
                              if (result) {
                                const sqlEduUpdate =
                                  "UPDATE job_seeker_edu_dtls SET job_seeker_edu_dtls_college =@collegeName,job_seeker_edu_dtls_university = @universityName,job_seeker_edu_starts_year = @startingYear,job_seeker_edu_end_year = @endingYear,job_seeker_edu_completion_dt = @completedYear,job_seeker_edu_percentage = @percentage,job_seeker_edu_skills = @skillsStringSet,job_seeker_edu_resume = @filename,job_seeker_edu_cr_dt= @timeStamp WHERE job_seeker_user_dtls_id = @userDtlsId and job_seeker_edu_dtls_email = @jobSeekerEmail";
                                request.query(sqlEduUpdate, (err, result) => {
                                  if (err)
                                    return res.send({ error: err.message });
                                  if (result) {
                                    if (haveExperience === "yes") {
                                      const sqlExpUpdate =
                                        "UPDATE job_seeker_exp_dtls set job_seeker_exp_company_name = @currentCompanyName,job_seeker_exp_job_role = @currentDesignation,job_seeker_exp_years = @experience,job_seeker_exp_current_salary = @currentCompanySalary,job_seeker_exp_expected_salary = @expectedSalary, job_seeker_exp_company_location = @companyLocation,job_seeker_exp_company_city = @companyCity, job_seeker_exp_company_state = @companyState,job_seeker_exp_company_country = @companyCountry, job_seeker_exp_cr_dt = @timestamp WHERE job_seeker_exp_user_dtls_id = @userDtlsId and job_seeker_exp_dtls_email = @jobSeekerEmail";
                                      request.query(
                                        sqlExpUpdate,
                                        (err, result) => {
                                          if (err)
                                            return res.send({
                                              error: err.message,
                                            });
                                          if (result) {
                                            const msg =
                                              jobApplicationAppliedEmail(
                                                jobSeekerEmail,
                                                fullname,
                                                jobRole
                                              );
                                            sgMail
                                              .send(msg)
                                              .then(() => {
                                                return res.send({
                                                  success:
                                                    "Successfully applied to the job",
                                                });
                                              })
                                              .catch((error) => {
                                                return res.send({
                                                  error:
                                                    "There is some error while applying the job",
                                                });
                                              });
                                          }
                                        }
                                      );
                                    } else {
                                      const msg = jobApplicationAppliedEmail(
                                        jobSeekerEmail,
                                        fullname,
                                        jobRole
                                      );
                                      sgMail
                                        .send(msg)
                                        .then(() => {
                                          return res.send({
                                            success:
                                              "Successfully applied to the job",
                                          });
                                        })
                                        .catch((error) => {
                                          return res.send({
                                            error:
                                              "There is some error while applying the job",
                                          });
                                        });
                                    }
                                  }
                                });
                              }
                            });
                          } else {
                            const msg = jobApplicationAppliedEmail(
                              jobSeekerEmail,
                              fullname,
                              jobRole
                            );
                            sgMail
                              .send(msg)
                              .then(() => {
                                return res.send({
                                  success: "Successfully applied to the job",
                                });
                              })
                              .catch((error) => {
                                return res.send({
                                  error:
                                    "There is some error while applying the job",
                                });
                              });
                          }
                        } else {
                          return res.send({
                            error:
                              "There was an error while applying the live class",
                          });
                        }
                      }
                    );
                  } else {
                    return res.send({
                      error: "There was an error while applying for the job",
                    });
                  }
                }
              );
            }
          }
        );
      });
    })
    .catch((error) => {
      return res.send({ error: "There was an error uploading the file" });
    });
  try {
  } catch (error) {
    res.send({ error: error.message });
  }
}

export async function getAllViewResponseForJobPost(req, res, next) {
  const jobPostUniqueId = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("uniqueId", sql.VarChar, jobPostUniqueId);
      request.query(
        "select * from job_post_master where apply_job_master_unique_id = @uniqueId",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({
              success: result.recordset,
            });
          } else {
            return res.send({ error: " " });
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export async function getJobAppliedStatus(req, res, next) {
  const jobPostUniqueId = req.params.id;
  const email = req.body.email;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("uniqueId", sql.VarChar, jobPostUniqueId);
      request.input("email", sql.VarChar, email);
      request.query(
        "select * from job_post_master where apply_job_master_unique_id = @uniqueId and apply_job_master_email = @email ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({
              success: "You have all ready applied to this job",
            });
          } else {
            return res.send({ error: "No you have not applied" });
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

export async function checkJobSeekerDetails(req, res) {
  const email = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "select a.job_seeker_profile_email, b.job_seeker_edu_dtls_email from job_seeker_profile a, job_seeker_edu_dtls b where a.job_seeker_profile_email=b.job_seeker_edu_dtls_email and a.job_seeker_profile_email= @email",
        (err, result) => {
          if (err) return console.log({ error: err.message });
          if (result.recordset.length > 0) {
            request.query(
              "select * from job_seeker_exp_dtls where job_seeker_exp_dtls_email = @email ",
              (err, result) => {
                if (err) return console.log({ error: err.message });
                if (result.recordset.length > 0) {
                  return res.send({ foundExp: "Found experience details" });
                } else {
                  console.log({ notFoundExp: "No experience details found" });
                }
              }
            );
          } else {
            return res.send({ notFound: "not found any details" });
          }
        }
      );
    });
  } catch (error) {}
}
// export async function checkJobSeekerDetails1(req, res) {
//   // const { email } = req.body.email;
//   try {
//     sql.connect(config, (err) => {
//       const request = new sql.Request();
//       // request.input("email", sql.VarChar, email);
//       const query3 =
//         "select a.job_seeker_profile_email, b.job_seeker_edu_dtls_email, c.job_seeker_exp_dtls_email from job_seeker_profile a, job_seeker_edu_dtls b, job_seeker_exp_dtls c where a.job_seeker_profile_email=b.job_seeker_edu_dtls_email and a.job_seeker_profile_email=c.job_seeker_exp_dtls_email and a.job_seeker_profile_email= 'b.mahesh311296@gmail.com'";
//       request.query(query3, (err, result) => {
//         if (err) return console.log({ error: err.message });
//         if (result.recordset.length > 0) {
//           console.log(result.recordset);
//         } else {
//           console.log(result);
//         }
//       });
//     });
//   } catch (error) {
//     return res.send({ error: error.message });
//   }
// }

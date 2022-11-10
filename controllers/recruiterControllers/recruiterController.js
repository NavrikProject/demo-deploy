import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import dotenv from "dotenv";
import path from "path";
import { traineeProfileUpdateEmailTemplate } from "../../middleware/traineeEmailTemplates.js";
import { jobPostEmailTemplate } from "../../middleware/jobPostEmailTemplate.js";
import { generateUniqueId } from "../../middleware/verifyToken.js";
const __dirname = path.resolve();
dotenv.config();

export async function addHiringCompanyDetails(req, res, next) {
  const {
    email,
    mobile,
    city,
    contactPerson,
    pincode,
    state,
    country,
    website,
    firmName,
    address,
    userEmail,
    imageFileName,
  } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.input("userEmail", sql.VarChar, userEmail);
      request.query(
        "select * from hiring_company_dtls where hiring_company_email = @email AND hiring_user_email = @userEmail",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({
              error: "You have all ready filled the firm details",
            });
          }
          if (result.recordset.length === 0) {
            sql.connect(config, async (err) => {
              if (err) res.send(err.message);
              const request = new sql.Request();
              var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
              request.query(
                "insert into hiring_company_dtls (hiring_user_email,hiring_company_email,hiring_company_name,hiring_company_address,hiring_company_city,hiring_company_state,hiring_company_country,hiring_company_pincode,hiring_company_contact_person,hiring_company_mobile,hiring_company_website,hiring_company_image,hiring_company_cr_dt) VALUES('" +
                  userEmail +
                  "', '" +
                  email +
                  "','" +
                  firmName +
                  "','" +
                  address +
                  "','" +
                  city +
                  "','" +
                  state +
                  "','" +
                  country +
                  "','" +
                  pincode +
                  "','" +
                  contactPerson +
                  "','" +
                  mobile +
                  "','" +
                  website +
                  "','" +
                  imageFileName +
                  "','" +
                  timestamp +
                  "' )",
                (err, success) => {
                  if (err) {
                    return res.send({ error: err.message });
                  }
                  if (success) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = traineeProfileUpdateEmailTemplate(
                      email,
                      firmName,
                      "hiring company details"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        return res.send({
                          success:
                            "Hiring company details added successfully, You can post the jobs Now!",
                        });
                      })
                      .catch((error) => {
                        return res.send({
                          error: error.message,
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
  } catch (error) {}
}

export async function getFirmAllDetails(req, res) {
  const email = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "select * from hiring_company_dtls where hiring_user_email = @email ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ found: result.recordset });
          } else {
            return res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

export async function createJobPost(req, res, next) {
  const email = req.params.id;
  let role = req.body.role;
  const {
    heading,
    category,
    skills,
    qualification,
    experience,
    salaryStarts,
    salaryTo,
    workType,
    jobType,
    positions,
    description,
    address,
    city,
    state,
    country,
    pincode,
    tags,
  } = req.body;
  role = role.replace(/\s+/g, "-").toLowerCase();
  const salary = salaryStarts + "-" + salaryTo;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "select * from hiring_company_dtls where hiring_user_email = @email",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            const hiringCompanyId = result.recordset[0].hiring_company_dtls_id;
            const hiringCompanyName = result.recordset[0].hiring_company_name;
            sql.connect(config, async (err) => {
              if (err) res.send(err.message);
              const request = new sql.Request();
              var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
              const jobUniqueId = generateUniqueId(10);
              request.query(
                "insert into job_post_dtls (job_post_unique_id,hiring_company_dtls_id,job_post_company_name,job_post_heading,job_post_category,job_post_req_skills,job_post_role,job_post_min_qual,job_post_min_exp,job_post_no_of_positions,job_post_work_type,job_post_job_type,job_post_expected_salary,job_post_description,job_post_street_address,job_post_city,job_post_state,job_post_country,job_post_pincode,job_post_tags,job_post_cr_dt) VALUES('" +
                  jobUniqueId +
                  "','" +
                  hiringCompanyId +
                  "', '" +
                  hiringCompanyName +
                  "','" +
                  heading +
                  "','" +
                  category +
                  "','" +
                  skills +
                  "','" +
                  role +
                  "','" +
                  qualification +
                  "','" +
                  experience +
                  "','" +
                  positions +
                  "','" +
                  workType +
                  "','" +
                  jobType +
                  "','" +
                  salary +
                  "','" +
                  description +
                  "','" +
                  address +
                  "','" +
                  city +
                  "','" +
                  state +
                  "','" +
                  country +
                  "','" +
                  pincode +
                  "','" +
                  tags +
                  "','" +
                  timestamp +
                  "' )",
                (err, success) => {
                  if (err) {
                    return res.send({ error: err.message });
                  }
                  if (success) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = jobPostEmailTemplate(email, hiringCompanyName);
                    sgMail
                      .send(msg)
                      .then(() => {
                        return res.send({
                          success: "Job posted successfully",
                        });
                      })
                      .catch((error) => {
                        return res.send({
                          error: error.message,
                        });
                      });
                  }
                }
              );
            });
          }
          if (result.recordset.length === 0) {
            return res.send({ error: "Please fill the firm details" });
          }
        }
      );
    });
  } catch (error) {}
}
export async function getAllClosedJobDetails(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from job_post_dtls where job_post_hiring_status ='recruited' and job_post_open_position_status = 'closed' order by job_post_dtls_id DESC ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

export async function getAllOpenJobDetails(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from job_post_dtls where job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' order by job_post_dtls_id DESC ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}
export async function updateJobPostToClosedState(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from job_post_dtls where job_post_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
            request.input("closedDate", sql.DateTime2, timestamp);
            const sqlUpdate =
              "update job_post_dtls set job_post_hiring_status ='recruited', job_post_open_position_status ='closed',job_post_closed_date=@closedDate where job_post_dtls_id = @id";
            request.query(sqlUpdate, (err, result) => {
              if (err) return res.send({ error: err.message });
              if (result) {
                return res.send({
                  success: "Successfully job is post is closed",
                });
              } else
                return res.send({
                  error: "There was an error updating the job",
                });
            });
          } else {
            res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

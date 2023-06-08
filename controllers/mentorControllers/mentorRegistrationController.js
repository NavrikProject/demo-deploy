import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import dotenv from "dotenv";
import intoStream from "into-stream";
import bcrypt from "bcrypt";
import { BlockBlobClient } from "@azure/storage-blob";
import { accountCreatedEmailTemplate } from "../../middleware/authEmailTemplate.js";
import { mentorApplicationEmail } from "../../middleware/mentorEmailTemplates.js";

dotenv.config();

export async function registerAMentorFirstTime(req, res, next) {
  const email = req.body.data.email;
  const firstName = req.body.data.firstName;
  const lastName = req.body.data.lastName;
  const lowEmail = email.toLowerCase();
  const password = req.body.data.password;
  const phoneNumber = req.body.phoneNumber;
  if (!lowEmail && !password && firstName && !lastName && !type) {
    return res.json({
      required: "ALl details must be required",
    });
  }
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(password, saltRounds);
  sql.connect(config, async (err) => {
    if (err) {
      return res.send(err.message);
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    request.query(
      "select * from users_dtls where user_email = @email",
      (err, result) => {
        if (err) return res.send(err.message);
        if (result.recordset.length > 0) {
          return res.send({
            exists:
              "This email address is already in use, Please use another email address",
          });
        } else {
          var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
          request.query(
            "insert into users_dtls (user_email,user_pwd,user_logindate,user_logintime,user_firstname,user_lastname,user_phone_number,user_creation,user_type) VALUES('" +
              email +
              "','" +
              hashedPassword +
              "','" +
              timestamp +
              "','" +
              timestamp +
              "','" +
              firstName +
              "','" +
              lastName +
              "','" +
              phoneNumber +
              "','" +
              timestamp +
              "','" +
              "mentor" +
              "' )",
            (err, success) => {
              if (err) {
                return res.send({ error: err.message });
              }
              if (success) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = accountCreatedEmailTemplate(
                  email,
                  firstName + " " + lastName
                );
                sgMail
                  .send(msg)
                  .then(() => {
                    return res.send({
                      success:
                        "Successfully created the new account Please login your account update all your details",
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
        }
      }
    );
  });
}

// to join as a mentor
export async function fillAdditionalMentorDetails(req, res) {
  let {
    email,
    firstname,
    lastname,
    bio,
    experience,
    skills,
    otherSkills,
    firm,
    currentRole,
    previousRole,
    specialty,
    mentorAvailability,
    startTime,
    endTime,
    mentorshipArea,
    website,
    linkedInProfile,
    phoneNumber,
  } = req.body;
  firstname = firstname.toLowerCase();
  lastname = lastname.toLowerCase();
  email = email.toLowerCase();
  if (
    !experience &&
    !skills &&
    !specialty &&
    !firstname &&
    !lastname &&
    !mentorshipArea &&
    !startTime &&
    !endTime &&
    !req.files.image
  ) {
    return res.send({
      error: "All details must be required",
    });
  }
  const blobName = new Date().getTime() + "-" + req.files?.image.name;
  const filename = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "select * from mentor_dtls where mentor_email = @email",
        (err, result) => {
          if (err)
            return res.send({
              error: "There was an error while submitting the application",
            });
          if (result.recordset.length > 0) {
            return res.send({
              success:
                "You have all ready submitted the mentor application we will get back to you once, We review your application.",
            });
          } else {
            const blobService = new BlockBlobClient(
              process.env.AZURE_STORAGE_CONNECTION_STRING,
              "practiwizcontainer/mentorprofilepictures",
              blobName
            );
            const stream = intoStream(req.files.image.data);
            const streamLength = req.files.image.data.length;
            blobService
              .uploadStream(stream, streamLength)
              .then((response) => {
                sql.connect(config, async (err) => {
                  let startDate = new Date().toISOString().substring(0, 10);
                  let endDate = addMonths(new Date(startDate), 3);
                  var timestamp = moment(Date.now()).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  endDate = endDate.toISOString().substring(0, 10);
                  if (err) res.send(err.message);
                  const request = new sql.Request();
                  request.query(
                    "insert into mentor_dtls(mentor_email,mentor_firstname,mentor_lastname,mentor_available_start_date,mentor_available_end_date,mentor_availability,mentor_availability_start_time,mentor_availability_end_time,mentor_creation,mentor_experience,mentor_skills,mentor_otherSkills,mentor_mentorship_area,mentor_speciality,mentor_bio,mentor_current_role,mentor_previous_role,mentor_firm,mentor_phone_number,mentor_website,mentor_linkedin_profile,mentor_image) VALUES('" +
                      email +
                      "','" +
                      firstname +
                      "','" +
                      lastname +
                      "','" +
                      startDate +
                      "','" +
                      endDate +
                      "','" +
                      mentorAvailability +
                      "','" +
                      startTime +
                      "','" +
                      endTime +
                      "','" +
                      timestamp +
                      "','" +
                      experience +
                      "','" +
                      skills +
                      "','" +
                      otherSkills +
                      "','" +
                      mentorshipArea +
                      "','" +
                      specialty +
                      "','" +
                      bio +
                      "','" +
                      currentRole +
                      "','" +
                      previousRole +
                      "','" +
                      firm +
                      "','" +
                      phoneNumber +
                      "','" +
                      website +
                      "','" +
                      linkedInProfile +
                      "','" +
                      filename +
                      "')",
                    (err, success) => {
                      if (err) {
                        return res.send({ error: err.message });
                      }
                      if (success) {
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        const msg = mentorApplicationEmail(
                          email,
                          firstname + " " + lastname
                        );
                        sgMail
                          .send(msg)
                          .then(() => {
                            return res.send({
                              success:
                                "Successfully submitted the mentor we will get back to you once, We review your application.",
                            });
                          })
                          .catch((error) => {
                            return res.send({
                              error:
                                "There was an error while submitting the details please try again later",
                            });
                          });
                      }
                    }
                  );
                });
              })
              .catch((error) => {
                return res.send({ error: error.message });
              });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}
// function to create add the Three months to joining date
function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

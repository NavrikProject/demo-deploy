import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import dotenv from "dotenv";
import azureStorage from "azure-storage";
import intoStream from "into-stream";
import bcrypt from "bcrypt";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import rp from "request-promise";
import axios from "axios";
import {
  appointmentBookedMentorEmailTemplate,
  appointmentBookedTraineeEmailTemplate,
  mentorApplicationEmail,
  mentorApproveEmail,
  mentorBankDetailsEmailTemplate,
  mentorDisApproveEmail,
} from "../../middleware/mentorEmailTemplates.js";
import { BlockBlobClient } from "@azure/storage-blob";

dotenv.config();

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
  const blobName = new Date().getTime() + "-" + req.files.image.name;
  const lowEmail = email.toLowerCase();

  let fileName = `https://navrik.blob.core.windows.net/navrikimage/${blobName}`;
  const stream = intoStream(req.files.image.data);
  const streamLength = req.files.image.data.length;

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
            sql.connect(config, async (err) => {
              let startDate = new Date().toISOString().substring(0, 10);
              let endDate = addMonths(new Date(startDate), 3);
              var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
              endDate = endDate.toISOString().substring(0, 10);
              if (err) res.send(err.message);
              const request = new sql.Request();
              request.query(
                "insert into mentor_dtls(mentor_email,mentor_firstname,mentor_lastname,mentor_available_start_date,mentor_available_end_date,mentor_availability,mentor_availability_start_time,mentor_availability_end_time,mentor_creation,mentor_experience,mentor_skills,mentor_otherSkills,mentor_mentorship_area,mentor_speciality,mentor_bio,mentor_current_role,mentor_previous_role,mentor_firm,mentor_phone_number,mentor_website,mentor_linkedin_profile,mentor_image) VALUES('" +
                  lowEmail +
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
                  fileName +
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
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

// get mentor full details in profile page
export async function getMentorProfileDetails(req, res, next) {
  const email = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ err: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "select * from mentor_dtls where mentor_email = @email",
        (err, results) => {
          if (err) return res.send({ err: err.message });
          if (results.recordset.length > 0) {
            return res.send({ success: results.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {}
}

// in dashboard
export async function getAllMentorDetails(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query("select * from mentor_dtls", (err, result) => {
        if (err) return res.send(err.message);
        if (result.recordset.length > 0) {
          return res.send({ mentors: result.recordset });
        } else {
          return;
        }
      });
    });
  } catch (error) {}
}

//get mentor search by the search
export async function getMentorBySearch(req, res) {
  let searchItem = req.query.name;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("searchItem", sql.VarChar, searchItem);
      const searchQuery =
        "SELECT * FROM mentor_dtls WHERE mentor_speciality = @searchItem";
      request.query(searchQuery, (err, result) => {
        if (err) return res.send(err.message);
        if (result.recordset.length > 0) {
          return res.send({ mentors: result.recordset });
        } else {
          res.send({ error: "Not found" });
        }
      });
    });
  } catch (error) {
    res.send(error.message);
  }
}
export async function getMentorByFiltering(req, res) {
  let category = req.query.category;
  let skill = req.query.skill;
  let area = req.query.area;
  let availability = req.query.availability;
  try {
    if (category && !skill && !availability && !area) {
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.input("category", sql.VarChar, category);
        const searchQuery =
          "SELECT * FROM mentor_dtls WHERE mentor_speciality = @category";
        request.query(searchQuery, (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ mentors: result.recordset });
          } else {
            res.send({ error: "Not found" });
          }
        });
      });
    } else if (category && skill && !availability && !area) {
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.input("category", sql.VarChar, category);
        request.input("skill", sql.VarChar, skill);
        request.input("area", sql.VarChar, area);
        request.input("availability", sql.VarChar, availability);
        const searchQuery =
          "SELECT * FROM mentor_dtls WHERE mentor_speciality = @category AND mentor_skills = @skill ";
        request.query(searchQuery, (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ mentors: result.recordset });
          } else {
            res.send({ error: "Not found" });
          }
        });
      });
    } else if (category && skill && area && !availability) {
      console.log("entered this function");
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.input("category", sql.VarChar, category);
        request.input("skill", sql.VarChar, skill);
        request.input("area", sql.VarChar, area);
        request.input("availability", sql.VarChar, availability);
        const searchQuery =
          "SELECT * FROM mentor_dtls WHERE mentor_speciality = @category AND mentor_mentorship_area = @area AND mentor_skills = @skill ";
        request.query(searchQuery, (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ mentors: result.recordset });
          } else {
            res.send({ error: "Not found" });
          }
        });
      });
    } else if (category && skill && area && availability) {
      sql.connect(config, (err) => {
        if (err) return res.send(err.message);
        const request = new sql.Request();
        request.input("category", sql.VarChar, category);
        request.input("skill", sql.VarChar, skill);
        request.input("area", sql.VarChar, area);
        request.input("availability", sql.VarChar, availability);
        const searchQuery =
          "SELECT * FROM mentor_dtls WHERE mentor_speciality = @category AND mentor_mentorship_area = @area AND mentor_skills = @skill AND mentor_availability = @availability";
        request.query(searchQuery, (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ mentors: result.recordset });
          } else {
            res.send({ error: "Not found" });
          }
        });
      });
    }
    // } else {
    //   sql.connect(config, (err) => {
    //     if (err) return res.send(err.message);
    //     const request = new sql.Request();
    //     request.input("category", sql.VarChar, category);
    //     request.input("skill", sql.VarChar, skill);
    //     request.input("area", sql.VarChar, area);
    //     request.input("availability", sql.VarChar, availability);
    //     const searchQuery = "SELECT * FROM mentor_dtls";
    //     request.query(searchQuery, (err, result) => {
    //       if (err) return res.send(err.message);
    //       if (result.recordset.length > 0) {
    //         return res.send({ mentors: result.recordset });
    //       } else {
    //         res.send({ error: "Not found" });
    //       }
    //     });
    //   });
    // }
  } catch (error) {
    res.send(error.message);
  }
}
// in web page show the approved candidates
export async function getAllMentorApprovedDetails(req, res) {
  let mentorApproved = "Yes";
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("mentorApproved", sql.VarChar, mentorApproved);
      request.query(
        "select * from mentor_dtls WHERE mentor_approved = @mentorApproved order by mentor_dtls_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ mentors: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return;
  }
}

// approving the mentor
export async function updateMentorApprove(req, res, next) {
  const paramsId = req.params.id;
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.input("id", sql.Int, paramsId);
      request.query(
        "SELECT * FROM mentor_dtls WHERE mentor_dtls_id = @id",
        (err, result) => {
          if (err) res.send(err.message);
          if (result.recordset.length > 0) {
            const mentorDisapproved = result.recordset[0].mentor_approved;
            const email = result.recordset[0].mentor_email;
            const fullname =
              result.recordset[0].mentor_firstname +
              " " +
              result.recordset[0].mentor_lastname;
            if (mentorDisapproved === "No") {
              const mentorApprove = "Yes";
              const request = new sql.Request();
              request.input("mentorApprove", sql.VarChar, mentorApprove);
              request.input("id", sql.Int, paramsId);
              const sqlUpdate =
                "UPDATE mentor_dtls SET mentor_approved = @mentorApprove WHERE mentor_dtls_id= @id ";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = mentorApproveEmail(email, fullname);
                  sgMail
                    .send(msg)
                    .then(() => {
                      res.send({
                        success:
                          "Successfully approved as mentor in the Practilearn",
                      });
                    })
                    .catch((error) => {
                      res.send({ error: error });
                    });
                } else {
                  res.send({
                    error: "There was an error updating",
                  });
                }
              });
            }
          } else {
            res.send({ error: "No user found" });
          }
        }
      );
    });
  } catch (error) {
    if (error) res.send(error.message);
  }
}

//disapproving the mentor
export async function updateMentorDisapprove(req, res, next) {
  const paramsId = req.params.id;
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.input("id", sql.Int, paramsId);
      request.query(
        "SELECT * FROM mentor_dtls WHERE  mentor_dtls_id = @id",
        (err, result) => {
          if (err) res.send(err.message);
          if (result.recordset.length > 0) {
            const mentorApproved = result.recordset[0].mentor_approved;
            const email = result.recordset[0].mentor_email;
            const fullname =
              result.recordset[0].mentor_firstname +
              " " +
              result.recordset[0].mentor_lastname;
            if (mentorApproved === "Yes") {
              const mentorDisapproved = "No";
              const request = new sql.Request();
              request.input(
                "mentorDisapproved",
                sql.VarChar,
                mentorDisapproved
              );
              request.input("id", sql.Int, paramsId);
              const sqlUpdate =
                "UPDATE mentor_dtls SET mentor_approved = @mentorDisapproved WHERE mentor_dtls_id= @id ";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = mentorDisApproveEmail(email, fullname);
                  sgMail
                    .send(msg)
                    .then(() => {
                      res.send({
                        success:
                          "Successfully disapproved as admin in the Practiwiz",
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

//create razor pay order
export async function createMentorRazorPayOrder(req, res, next) {
  const { mentorId, date } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) {
        return res.send(err.message);
      }
      const request = new sql.Request();
      request.input("date", sql.Date, date);
      request.input("mentorId", sql.Int, mentorId);
      request.query(
        "select * from mentor_dtls where mentor_dtls_id = @mentorId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const mentorPrice = result.recordset[0].mentor_price;

            const instance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
            });
            const options = {
              amount: mentorPrice * 100,
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
    return res.send({ error: error.message });
  }
}

const payload = {
  iss: process.env.ZOOM_APP_API_KEY,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_APP_API_SECRET_KEY);

// create an appointment
export async function createMentorAppointment(req, res, next) {
  const {
    mentorId,
    mentorEmail,
    userEmail,
    from,
    to,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    date,
    mentorName,
    username,
  } = req.body;
  const { selected, questions } = req.body.data;
  const timeSlot = from + " " + "to" + " " + to;
  try {
    const result = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: `Discussion with ${username}`,
        type: 2,
        start_time: new Date(date),
        duration: 20,
        timezone: "India",
        password: "1234567",
        agenda: `We will discuss about the ${questions + " " + selected}`,
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
      sql.connect(config, async (err) => {
        if (err) res.send(err.message);
        const request = new sql.Request();
        let amountPaid = "Paid";
        request.query(
          "insert into booking_appointments_dtls (mentor_dtls_id,mentor_email,mentor_name,user_email,user_fullname,booking_mentor_date,booking_date,booking_starts_time,booking_end_time,booking_time,mentor_amount,mentor_options,mentor_questions,mentor_razorpay_payment_id,mentor_razorpay_order_id,mentor_razorpay_signature,mentor_host_url,trainee_join_url,mentor_amount_paid_status) VALUES('" +
            mentorId +
            "','" +
            mentorEmail +
            "','" +
            mentorName +
            "','" +
            userEmail +
            "','" +
            username +
            "','" +
            date +
            "','" +
            new Date().toISOString().substring(0, 10) +
            "','" +
            from +
            "','" +
            to +
            "','" +
            timeSlot +
            "','" +
            amount / 100 +
            "','" +
            selected +
            "','" +
            questions +
            "','" +
            razorpayPaymentId +
            "','" +
            razorpayOrderId +
            "','" +
            razorpaySignature +
            "','" +
            mentorHostUrl +
            "','" +
            traineeJoinUrl +
            "','" +
            amountPaid +
            "' )",
          (err, success) => {
            if (err) {
              return res.send({ error: err.message });
            }
            if (success) {
              sgMail.setApiKey(process.env.SENDGRID_API_KEY);
              const msg = appointmentBookedTraineeEmailTemplate(
                userEmail,
                username,
                mentorName,
                new Date(date).toDateString(),
                timeSlot
              );
              sgMail
                .send(msg)
                .then(() => {
                  const msg = appointmentBookedMentorEmailTemplate(
                    mentorEmail,
                    mentorName,
                    username,
                    new Date(date).toDateString(),
                    timeSlot
                  );
                  sgMail
                    .send(msg)
                    .then(() => {
                      res.send({
                        success:
                          "Successfully appointment is booked and mentor will be available on the same day with respective time",
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
                    error: "There was an error while booking the appointment",
                  });
                });
            }
          }
        );
      });
    }
  } catch (error) {
    res.send({
      error: "There was an error while booking the appointment",
    });
  }
}

export async function getAllMentorApprovedDetailsAndAvailability(req, res) {
  let mentorApproved = "Yes";
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("mentorApproved", sql.VarChar, mentorApproved);
      request.query(
        "select * from mentor_dtls WHERE mentor_approved = @mentorApproved AND mentor_availability",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            return res.send({ mentors: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {}
}

// to get only appointment dates in booking table
export async function getBookingDates(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query(
        "select * from booking_appointments_dtls where mentor_session_status = 'upcoming' and trainee_session_status = 'upcoming'",
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

// get individual mentor details in individual page
export async function getIndividualMentorDetails(req, res) {
  let mentorName = req.query.name;
  mentorName = mentorName.split("-");
  let firstName = mentorName[0];
  let lastName = mentorName[1];

  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("firstName", sql.VarChar, firstName);
      request.input("lastName", sql.VarChar, lastName);
      const searchQuery =
        "SELECT * FROM mentor_dtls WHERE mentor_firstname = @firstName AND mentor_lastname = @lastName and mentor_approved = 'Yes' ";
      request.query(searchQuery, (err, result) => {
        if (err) return res.send(err.message);
        if (result.recordset.length > 0) {
          return res.send(result.recordset);
        } else {
          return;
        }
      });
    });
  } catch (error) {
    res.send(error.message);
  }
}

// fill mentor bank account details.
export async function addBankAccountDetailsOfMentor(req, res, next) {
  const id = req.params.id;
  let { accountNumber, ifscCode, fullName } = req.body;
  fullName = fullName.toUpperCase();
  const hashedIfscCode = await bcrypt.hash(ifscCode, 12);
  const hashedAccountNumber = await bcrypt.hash(accountNumber, 12);

  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "SELECT * FROM users_dtls WHERE user_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            const userId = result.recordset[0].user_dtls_id;
            sql.connect(config, (err) => {
              if (err) return res.send({ error: err.message });
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              const approved = "Yes";
              request.input("approved", sql.VarChar, approved);
              request.query(
                "select * from mentor_dtls where mentor_email = @email and mentor_approved = @approved",
                (err, result) => {
                  if (err) return res.send({ error: err.message });
                  if (result.recordset.length > 0) {
                    sql.connect(config, (err) => {
                      if (err) return res.send({ error: err.message });
                      const request = new sql.Request();
                      request.input("email", sql.VarChar, email);
                      request.query(
                        "SELECT * FROM mentor_dtls WHERE mentor_email= @email",
                        (err, result) => {
                          if (err) return res.send({ error: err.message });
                          if (result.recordset.length > 0) {
                            const mentorProfileId =
                              result.recordset[0].mentor_dtls_id;
                            var timestamp = moment(Date.now()).format(
                              "YYYY-MM-DD HH:mm:ss"
                            );
                            sql.connect(config, (err) => {
                              if (err)
                                return res.send({
                                  error: err.message,
                                });
                              const request = new sql.Request();
                              request.input("email", sql.VarChar, email);
                              request.input("userId", sql.Int, userId);
                              request.input(
                                "mentorProfileId",
                                sql.Int,
                                mentorProfileId
                              );
                              request.query(
                                "SELECT * FROM mentor_bank_ac_dtls WHERE mentor_bank_ac_user_id = @userId AND  mentor_bank_ac_mentor_profile_id= @mentorProfileId AND mentor_bank_ac_mentor_email= @email",
                                (err, result) => {
                                  if (err)
                                    return res.send({
                                      error:
                                        "There was and was an error while uploading the account details",
                                    });
                                  if (result.recordset.length > 0) {
                                    return res.send({
                                      success:
                                        "You have all ready fill this bank account details",
                                    });
                                  } else {
                                    sql.connect(config, (err) => {
                                      if (err)
                                        return res.send({
                                          error: err.message,
                                        });
                                      const request = new sql.Request();
                                      var timestamp = moment(Date.now()).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                      );
                                      request.query(
                                        "INSERT INTO mentor_bank_ac_dtls (mentor_bank_ac_user_id, mentor_bank_ac_mentor_profile_id,mentor_bank_ac_mentor_email,mentor_bank_ac_fullname, mentor_bank_ac_number,mentor_bank_ac_ifsc,mentor_bank_ac_cr_date) VALUES('" +
                                          userId +
                                          "','" +
                                          mentorProfileId +
                                          "','" +
                                          email +
                                          "','" +
                                          fullName +
                                          "','" +
                                          hashedAccountNumber +
                                          "', '" +
                                          hashedIfscCode +
                                          "','" +
                                          timestamp +
                                          "' )",
                                        (err, result) => {
                                          if (err) return res.send(err.message);
                                          if (result) {
                                            sgMail.setApiKey(
                                              process.env.SENDGRID_API_KEY
                                            );
                                            const msg =
                                              mentorBankDetailsEmailTemplate(
                                                email,
                                                fullName
                                              );
                                            sgMail
                                              .send(msg)
                                              .then(() => {
                                                return res.send({
                                                  success:
                                                    "Bank account details added successfully,Thank You!",
                                                });
                                              })
                                              .catch((error) => {
                                                return res.send({
                                                  error:
                                                    "There was and was an error while uploading the account details",
                                                });
                                              });
                                          } else {
                                            return res.send({
                                              error:
                                                "There was and was an error while uploading the account details",
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
                              error:
                                "No user found Please update the profile details",
                            });
                          }
                        }
                      );
                    });
                  } else {
                    return res.send({
                      error:
                        "Sorry, You can not add the bank account details, your application is under verification.",
                    });
                  }
                }
              );
            });
          } else {
            res.send({
              error: "No user found Please update the profile details",
            });
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
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

function addDays(date, days) {
  var d = date.getDay();
  date.setDay(date.getDay() + days);
  if (date.getDay() != d) {
    date.setDay(0);
  }
  return date;
}
//console.log(addMonths(new Date(), 3));
// console.log("The input date is :---- " + new Date("2022-01-01T12:46:02.166Z"));
// console.log(
//   "Final date after Three months is :---- " +
//     addMonths(new Date("2022-01-01T12:46:02.166Z"), 3)
// );

function findTheDateRangeAndWeekdays(startDate, endDate) {
  let count = 0;
  let newDates = [];
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      newDates.push(curDate.toLocaleDateString());
      count++;
      //console.log(new Date(curDate).toLocaleDateString());
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return newDates;
}

// to join as a mentor
export async function registerMentorWithAdditionalDtls(req, res) {
  let {
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    bio,
    experience,
    speciality,
    skills,
    otherSkills,
    firm,
    currentRole,
    previousRole,
    website,
    linkedInProfile,
    mentorshipArea,
    mentorAvailability,
    startTime,
    endTime,
    imageFileName,
  } = req.body;
  firstName = firstName.toLowerCase();
  lastName = lastName.toLowerCase();
  if (
    !email &&
    experience &&
    skills &&
    speciality &&
    password &&
    firstName &&
    lastName &&
    mentorshipArea &&
    from &&
    to &&
    req.files.image
  ) {
    return res.send({
      error: "All details must be required",
    });
  }
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(password, saltRounds);
  const lowEmail = email.toLowerCase();
  try {
    const blobName = new Date().getTime() + "-" + req.files.image.name;
    const filename = `https://navrikimages.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
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
                  error:
                    "This email address is already in use, Please use another email address",
                });
              } else {
                sql.connect(config, async (err) => {
                  if (err) res.send(err.message);
                  var timestamp = moment(Date.now()).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  const type = "mentor";
                  const request = new sql.Request();
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
                      type +
                      "' )",
                    (err, success) => {
                      if (err) {
                        return res.send({ error: err.message });
                      }
                      if (success) {
                        sql.connect(config, async (err) => {
                          let startDate = new Date()
                            .toISOString()
                            .substring(0, 10);
                          let endDate = addMonths(new Date(startDate), 3);
                          endDate = endDate.toISOString().substring(0, 10);
                          if (err) res.send(err.message);
                          const request = new sql.Request();
                          request.query(
                            "insert into mentor_dtls (mentor_email,mentor_firstname,mentor_lastname,mentor_available_start_date,mentor_available_end_date,mentor_availability,mentor_availability_start_time,mentor_availability_end_time,mentor_creation,mentor_experience,mentor_skills,mentor_otherSkills,mentor_mentorship_area,mentor_speciality,mentor_bio,mentor_current_role,mentor_previous_role,mentor_firm,mentor_phone_number,mentor_website,mentor_linkedin_profile, mentor_sessions_conducted,mentor_image) VALUES('" +
                              email +
                              "','" +
                              firstName +
                              "','" +
                              lastName +
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
                              speciality +
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
                              0 +
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
                                  firstName + " " + lastName
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
                      }
                    }
                  );
                });
              }
            }
          );
        });
      })
      .catch((err) => {
        return res.send({ error: "There was an error uploading" });
      });
  } catch (error) {
    return res.send({ error: "There was an error uploading" });
  }
}

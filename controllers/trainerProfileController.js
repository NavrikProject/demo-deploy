import moment from "moment";
import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import azureStorage from "azure-storage";
import intoStream from "into-stream";
import dotenv from "dotenv";
import updateEmail from "../middleware/updateEmail.js";
import bcrypt from "bcrypt";
const containerName = "navrikimage";

dotenv.config();
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
// inserting data into the trainee profile
export function updateTrainerProfileDetailsController(req, res, next) {
  const id = req.params.id;
  const {
    firstName,
    lastName,
    mobileNumber,
    experience,
    qualification,
    prefTime,
    noOfHrs,
    engType,
    skills,
    lnProfile,
    description,
    location,
  } = req.body;

  const blobName = new Date().getTime() + "-" + req.files.image.name;

  let fileName = `https://navrik.blob.core.windows.net/navrikimage/${blobName}`;

  const stream = intoStream(req.files.image.data);
  const streamLength = req.files.image.data.length;

  blobService.createBlockBlobFromStream(
    containerName,
    blobName,
    stream,
    streamLength,
    (err) => {
      if (err) {
        res.status(500);
        res.send({ error: "Error Occurred" });
        return;
      }
      if (!err) {
        try {
          sql.connect(config, (err) => {
            if (err) return res.send(err.message);
            const request = new sql.Request();
            request.input("id", sql.Int, id);
            request.query(
              "SELECT * FROM users_dtls WHERE user_dtls_id = @id",
              (err, result) => {
                if (err) return res.send(err.message);
                if (result.recordset.length > 0) {
                  const email = result.recordset[0].user_email;
                  sql.connect(config, (err) => {
                    if (err) return res.send({ error: error.message });
                    const request = new sql.Request();
                    request.query(
                      "INSERT INTO trainer_profile (trainer_email,trainer_firstname,trainer_lastname,trainer_mobile,trainer_lnprofile,trainer_qualifications,trainer_skills,trainer_exp_yrs,trainer_pref_time,trainer_engment_typ,trainer_no_of_hrs_daily,trainer_location,trainer_description,trainer_image) VALUES('" +
                        email +
                        "','" +
                        firstName +
                        "','" +
                        lastName +
                        "','" +
                        mobileNumber +
                        "','" +
                        lnProfile +
                        "', '" +
                        qualification +
                        "','" +
                        skills +
                        "', '" +
                        experience +
                        "','" +
                        prefTime +
                        "','" +
                        engType +
                        "','" +
                        noOfHrs +
                        "','" +
                        location +
                        "','" +
                        description +
                        "','" +
                        fileName +
                        "')",
                      (err, result) => {
                        if (err) return res.send(err.message);
                        if (result) {
                          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                          const msg = updateEmail(
                            email,
                            "Profile details saved successfully",
                            "updated Profile details"
                          );
                          sgMail
                            .send(msg)
                            .then(() => {
                              return res.send({
                                success:
                                  "Profile details is success fully saved",
                              });
                            })
                            .catch((error) => {
                              return res.send({
                                error: "There is some error while saving",
                              });
                            });
                        } else {
                          return res.send({
                            error: "There is some error while saving",
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
          res.send(error.message);
        }
      }
    }
  );
}

//need to be checked
export function getTrainerProfileDetailsController(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from users_dtls WHERE user_dtls_id = @id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            sql.connect(config, (err) => {
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainer_profile WHERE trainer_email = @email",
                (err, result) => {
                  if (err) {
                    res.send({ error: err.message });
                  }
                  if (result.recordset.length > 0) {
                    res.send(result.recordset);
                  } else {
                    return res.send({ notfound: "not found" });
                  }
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

// update in the users table firstname and lastname && working accurately
export function updateTrainerUserAccountCtrl(req, res) {
  const id = req.params.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  if (!firstName || !lastName) {
    return res.json({ error: "This fields are required" });
  }
  try {
    sql.connect(config, (err) => {
      if (err) res.send(err.message);
      const request = new sql.Request();
      request.input("firstName", sql.VarChar, firstName);
      request.input("lastName", sql.VarChar, lastName);
      request.input("id", sql.Int, id);
      request.query(
        "UPDATE users_dtls SET user_firstname= @firstName, user_lastname = @lastName WHERE user_dtls_id = @id",
        (err, response) => {
          if (err) {
            return res.send({
              error: "There was an error updating the account details",
            });
          }
          if (response) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = updateEmail(
              email,
              "Account details updated successfully",
              "update the account details"
            );
            sgMail
              .send(msg)
              .then(() => {
                return res.send({
                  success:
                    "Successfully update the account details, Login again in order to get your information",
                });
              })
              .catch((error) => {
                return res.send({
                  error: "There is some error while saving",
                });
              });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

// needs to be checked
export function updateTrainerProfilePicture(req, res) {
  const id = req.params.id;
  if (!req.files) {
    return res.send({ error: "Please select a file to upload" });
  }
  const blobName = new Date().getTime() + "-" + req.files.image.name;
  let fileName = `https://navrik.blob.core.windows.net/navrikimage/${blobName}`;
  const stream = intoStream(req.files.image.data);
  const streamLength = req.files.image.data.length;
  try {
    sql.connect(config, (error) => {
      if (error) {
        res.send(error);
      }
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from users_dtls where user_dtls_id = @id",
        (err, result) => {
          if (err) res.send(err);
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            sql.connect(config, (error) => {
              if (error) {
                res.send(error);
              }
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainer_profile WHERE trainer_email = @email",
                (err, result) => {
                  if (err) res.send(err);
                  if (result.recordset.length > 0) {
                    blobService.createBlockBlobFromStream(
                      containerName,
                      blobName,
                      stream,
                      streamLength,
                      (err) => {
                        if (err) {
                          return res.send({ error: "Error Occurred" });
                        }
                        if (!err) {
                          sql.connect(config, (err) => {
                            if (err) res.send(err.message);
                            const request = new sql.Request();
                            request.input("email", sql.VarChar, email);
                            request.input("fileName", sql.VarChar, fileName);
                            request.query(
                              "UPDATE trainer_profile SET trainer_image = @fileName WHERE trainer_email = @email ",
                              (err, response) => {
                                if (err) {
                                  return res.send({
                                    error: "No user found",
                                  });
                                }
                                if (response) {
                                  return res.send({
                                    upload:
                                      "Profile picture updated successfully",
                                  });
                                }
                              }
                            );
                          });
                        }
                      }
                    );
                  } else {
                    res.send("Please update the trainee details ");
                  }
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {
    if (error) {
      res.send(error.message);
    }
  }
}

// needs to be checked
export function updateTechnicalDetails(req, res) {
  const id = req.params.id;
  const {
    firstName,
    lastName,
    mobileNumber,
    experience,
    qualification,
    prefTime,
    noOfHrs,
    engType,
    skills,
    lnProfile,
    description,
    location,
  } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from users_dtls where user_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            sql.connect(config, (err) => {
              if (err) return res.send({ error: error.message });
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "select * from trainer_profile where trainer_email = @email",
                (err, result) => {
                  if (err) return res.send({ error: err.message });
                  if (result.recordset.length > 0) {
                    const trainerId = result.recordset[0].trainer_profile_id;
                    sql.connect(config, (err) => {
                      if (err) return res.send({ error: error.message });
                      const request = new sql.Request();
                      request.input("firstName", sql.VarChar, firstName);
                      request.input("lastName", sql.VarChar, lastName);
                      request.input("mobileNumber", sql.Int, mobileNumber);
                      request.input("experience", sql.VarChar, experience);
                      request.input(
                        "qualification",
                        sql.VarChar,
                        qualification
                      );
                      request.input("prefTime", sql.VarChar, prefTime);
                      request.input("noOfHrs", sql.Int, noOfHrs);
                      request.input("engType", sql.VarChar, engType);
                      request.input("skills", sql.VarChar, skills);
                      request.input("lnProfile", sql.VarChar, lnProfile);
                      request.input("description", sql.VarChar, description);
                      request.input("location", sql.VarChar, location);
                      request.input("trainerId", sql.Int, trainerId);
                      request.query(
                        "UPDATE trainer_profile SET trainer_firstname=@firstName, trainer_lastname=@lastName,trainer_mobile=@mobileNumber,trainer_lnprofile=@lnProfile,trainer_qualifications=@qualification,trainer_skills=@skills,trainer_exp_yrs=@experience,trainer_pref_time=@prefTime,trainer_engment_typ=@engType,trainer_no_of_hrs_daily=@noOfHrs,trainer_location=@location,trainer_description=@description, WHERE trainer_profile_id = @trainerId",
                        (err, result) => {
                          if (err) return res.send({ error: err.message });
                          if (result) {
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            const msg = updateEmail(
                              email,
                              "Technical details updated successfully",
                              "updated the technical details"
                            );
                            sgMail
                              .send(msg)
                              .then(() => {
                                res.send({
                                  success:
                                    "Successfully updated the technical details",
                                });
                              })
                              .catch((error) => {
                                return res.send({
                                  error: "There is some error while saving",
                                });
                              });
                          }
                        }
                      );
                    });
                  } else {
                    res.send({
                      error:
                        "no user found please update the trainer details clicking on the button",
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
    res.send({ error: error.message });
  }
}

// get courses by trainer in the single trainer pages
export function getOnlyTrainerCourses(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "SELECT * FROM courses_dtls WHERE course_trainer_profile_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

// add bank account details to the dbConnection
export async function addBankAccountDetails(req, res, next) {
  const id = req.params.id;
  let { accountNumber, ifscCode, fullName } = req.body;
  fullName = fullName.toUpperCase();
  const hashedIfscCode = await bcrypt.hash(ifscCode, 12);
  const hashedAccountNumber = await bcrypt.hash(accountNumber, 12);

  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
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
              if (err) return res.send({ error: error.message });
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainer_profile WHERE trainer_email= @email",
                (err, result) => {
                  if (err) return res.send({ error: err.message });
                  if (result.recordset.length > 0) {
                    const trainerProfileId =
                      result.recordset[0].trainer_profile_id;
                    var timestamp = moment(Date.now()).format(
                      "YYYY-MM-DD HH:mm:ss"
                    );
                    sql.connect(config, (err) => {
                      if (err) return res.send({ error: error.message });
                      const request = new sql.Request();
                      request.input("email", sql.VarChar, email);
                      request.input("userId", sql.Int, userId);
                      request.input(
                        "trainerProfileId",
                        sql.Int,
                        trainerProfileId
                      );
                      request.query(
                        "SELECT * FROM trainer_bank_ac_dtls WHERE trainer_bank_ac_user_id= @userId AND  trainer_bank_ac_trainer_profile_id= @trainerProfileId AND trainer_bank_ac_trainer_email= @email",
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
                                return res.send({ error: error.message });
                              const request = new sql.Request();
                              var timestamp = moment(Date.now()).format(
                                "YYYY-MM-DD HH:mm:ss"
                              );
                              request.query(
                                "INSERT INTO trainer_bank_ac_dtls (trainer_bank_ac_user_id, trainer_bank_ac_trainer_profile_id,trainer_bank_ac_trainer_email,trainer_bank_ac_fullname, trainer_bank_ac_number,trainer_bank_ac_ifsc,trainer_bank_ac_cr_date) VALUES('" +
                                  userId +
                                  "','" +
                                  trainerProfileId +
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

                                    const msg = updateEmail(
                                      email,
                                      "Added bank details successfully",
                                      "Added bank details"
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
                      error: "No user found Please update the profile details",
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

// get trainer courses in single trainer page
export function getTrainerProfileDetailsInSinglePage(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "SELECT * FROM trainer_profile WHERE trainer_profile_id=@id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

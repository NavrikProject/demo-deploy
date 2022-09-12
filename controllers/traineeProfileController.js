import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import azureStorage from "azure-storage";
import intoStream from "into-stream";
import dotenv from "dotenv";
import updateEmail from "../middleware/updateEmail.js";

const containerName = "navrikimage";

dotenv.config();
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
// inserting the data to the trainee details from profile && working accurately
export async function createTraineeProfile(req, res, next) {
  const id = req.params.id;
  const mobile = req.body.mobile;
  const dob = req.body.dob;
  const graduate = req.body.graduate;
  const profession = req.body.profession;
  const experience = req.body.experience;
  const address = req.body.address;
  const blobName = new Date().getTime() + "-" + req.files.image.name;

  let fileName = `https://navrik.blob.core.windows.net/navrikimage/${blobName}`;

  const stream = intoStream(req.files.image.data);
  const streamLength = req.files.image.data.length;
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
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainee_dtls WHERE trainee_email = @email",
                (err, result) => {
                  if (err) return res.send(err.message);
                  if (result.recordset.length > 0) {
                    return res.send({
                      error: "You have already submitted the profile details!",
                    });
                  } else {
                    sql.connect(config, (err) => {
                      if (err) return res.send({ error: error.message });
                      const request = new sql.Request();
                      request.query(
                        "INSERT INTO trainee_dtls (trainee_email, trainee_mobile, trainee_dob,trainee_image,trainee_address,trainee_experience,trainee_graduate, trainee_profession) VALUES('" +
                          email +
                          "','" +
                          mobile +
                          "','" +
                          dob +
                          "','" +
                          fileName +
                          "','" +
                          address +
                          "', '" +
                          experience +
                          "','" +
                          graduate +
                          "', '" +
                          profession +
                          "' )",
                        (err, result) => {
                          if (err) return res.send(err.message);
                          if (result) {
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            const msg = updateEmail(
                              email,
                              "Profile details saved successfully",
                              "updated the Profile details."
                            );
                            sgMail
                              .send(msg)
                              .then(() => {
                                return res.send({
                                  success:
                                    "Profile details are saved successfully",
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
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }

  // blobService.createBlockBlobFromStream(
  //   containerName,
  //   blobName,
  //   stream,
  //   streamLength,
  //   (err) => {
  //     if (err) {
  //       res.status(500);
  //       res.send({ error: "Error Occurred" });
  //       return;
  //     }
  //     if (!err) {
  //     }
  //   }
  // );
}

// showing the form the profile form working && working accurately
export function checkTraineeDetails(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "SELECT * FROM users_dtls WHERE user_dtls_id =@id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            sql.connect(config, (err) => {
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainee_dtls WHERE trainee_email = @email",
                (err, result) => {
                  if (err) return res.send(err.message);
                  if (result.recordset.length > 0) {
                    return res.send({ found: "Data found" });
                  } else {
                    return res.send({ notFound: "Data not found" });
                  }
                }
              );
            });
          } else {
            return res.send({ notFound: "Data not found" });
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

// to get trainee details in navbar and flex page && working accurately
export function getTraineeAllDetails(req, res) {
  const id = req.params.id;
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
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainee_dtls WHERE trainee_email = @email",
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
            return;
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

// in trainer profile section updating the personal details && working accurately
export async function updateTraineeProfile(req, res, next) {
  const id = req.params.id;
  const mobile = req.body.mobile;
  const dob = req.body.dob;
  const graduate = req.body.graduate;
  const profession = req.body.profession;
  const experience = req.body.experience;
  const address = req.body.address;

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
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM trainee_dtls WHERE trainee_email = @email",
                (err, result) => {
                  if (err) return res.send(err.message);
                  if (result.recordset.length > 0) {
                    sql.connect(config, (err) => {
                      if (err) res.send(err.message);
                      const request = new sql.Request();
                      request.input("graduate", sql.VarChar, graduate);
                      request.input("profession", sql.VarChar, profession);
                      request.input("mobile", sql.VarChar, mobile);
                      request.input("dob", sql.Date, dob);
                      request.input("experience", sql.Int, experience);
                      request.input("address", sql.VarChar, address);
                      request.input("email", sql.VarChar, email);
                      request.query(
                        "UPDATE trainee_dtls SET trainee_mobile=@mobile,trainee_dob=@dob, trainee_address=@address, trainee_experience=@experience, trainee_graduate=@graduate,trainee_profession=@profession WHERE trainee_email=@email",
                        (err, response) => {
                          if (err) {
                            return res.send({
                              error:
                                "There was an error updating the personal details",
                            });
                          }
                          if (response) {
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            const msg = updateEmail(
                              email,
                              "Profile details saved successfully",
                              "updated personal details saved."
                            );
                            sgMail
                              .send(msg)
                              .then(() => {
                                return res.send({
                                  success:
                                    "Successfully updated the personal details",
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
                    return;
                  }
                }
              );
            });
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

// in trainer profile section updating the account details && working accurately
export async function updateTraineeAccountDetails(req, res) {
  const id = req.params.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  if (!firstName || !lastName) {
    return res.send({
      error: "This fields must be required",
    });
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
            return res.send({
              success:
                "Successfully update the account details, Login again in order to get your information",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

// image upload && working accurately
export async function uploadUserImage(req, res) {
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
                "SELECT * FROM trainee_dtls WHERE trainee_email = @email",
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
                          res.status(500);
                          res.send({ error: "Error Occurred" });
                          return;
                        }
                        if (!err) {
                          sql.connect(config, (err) => {
                            if (err) res.send(err.message);
                            const request = new sql.Request();
                            request.input("email", sql.VarChar, email);
                            request.input("fileName", sql.VarChar, fileName);
                            request.query(
                              "UPDATE trainee_dtls SET trainee_image = @fileName WHERE trainee_email = @email ",
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
                    res.send("Please update the trainee details 2");
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

export async function getOnlyUserDetails(req, res, next) {
  const id = req.params.id;

  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "SELECT * FROM user_dtls WHERE user_dtls_id =@id",
        (err, result) => {
          if (result) {
            res.send({ success: result.recordset });
          } else {
            res.send({
              error: "Please update the details of the user",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

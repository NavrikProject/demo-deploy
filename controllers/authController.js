import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import sendEmail from "../middleware/sendEmail.js";
import dotenv from "dotenv";
import updateEmail from "../middleware/updateEmail.js";
dotenv.config();

export async function emailRegister(req, res, next) {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const type = req.body.radio;
  const lowEmail = email.toLowerCase();
  const password = req.body.password;

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
          const emailActivationToken = jwt.sign(
            {
              email: lowEmail,
              firstName: firstName,
              lastName: lastName,
              type: type,
              password: hashedPassword,
            },
            process.env.JWT_EMAIL_ACTIVATION_KEY,
            { expiresIn: "30m" }
          );
          const url = `${process.env.FRONT_END_LINK}/user/activate/account/${emailActivationToken}`;
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = sendEmail(
            lowEmail,
            url,
            "Account activation link",
            "Click to activate account"
          );
          sgMail
            .send(msg)
            .then(() => {
              return res.send({
                success:
                  "Successfully created the account, Please check your email and activate",
              });
            })
            .catch((error) => {
              return res.send({
                error:
                  "There was an error while creating the account please try again later",
              });
            });
        }
      }
    );
  });
}

export async function emailAccountActivation(req, res) {
  const id = req.params.id;
  const signupToken = req.body.signUpToken;
  if (signupToken) {
    jwt.verify(
      signupToken,
      process.env.JWT_EMAIL_ACTIVATION_KEY,
      (err, decodedToken) => {
        if (err) {
          return res.send(err.status);
        } else {
          const { email, firstName, lastName, type, password } = decodedToken;
          var timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
          sql.connect(config, async (err) => {
            if (err) {
              return res.send(err.message);
            }
            const request = new sql.Request();
            request.input("email", sql.VarChar, email);
            request.query(
              `select * from users_dtls where user_email = @email`,
              (err, result) => {
                if (result.recordset.length > 0) {
                  return res.send({
                    error: "This email address all ready exists Please sign in",
                  });
                } else {
                  sql.connect(config, async (err) => {
                    if (err) res.send(err.message);
                    const request = new sql.Request();
                    request.query(
                      "insert into users_dtls (user_email,user_pwd,user_logindate,user_logintime,user_firstname,user_lastname,user_creation,user_type) VALUES('" +
                        email +
                        "','" +
                        password +
                        "','" +
                        timestamp +
                        "','" +
                        timestamp +
                        "','" +
                        firstName +
                        "','" +
                        lastName +
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
                          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                          const msg = updateEmail(
                            email,
                            "Account created successfully",
                            "Created an account, You are ready to start using our platform."
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
                                error:
                                  "There was an error creating the user please try again later",
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
  } else {
    return res.send("invalid");
  }
}

export async function login(req, res) {
  const username = req.body.data.email;
  const lowEmail = username.toLowerCase();
  const password = req.body.data.password;
  const type = req.body.type;
  if (!username || !password || !type) {
    res
      .status(500)
      .send("Please enter a username, password and user type to login");
  }
  sql.connect(config, async (err) => {
    if (err) {
      res.send(err.message);
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    request.input("type", sql.VarChar, type);
    request.query(
      `select * from users_dtls where user_email = @email AND user_type = @type`,
      (err, result) => {
        if (result.recordset.length > 0) {
          bcrypt.compare(
            password,
            result.recordset[0].user_pwd,
            (err, response) => {
              if (!response) {
                return res.json({
                  notFound:
                    "You have entered incorrect password,Please try again or re-enter your password",
                });
              }
              if (response) {
                const accessToken = jwt.sign(
                  {
                    id: result.recordset[0].user_dtls_id,
                    email: result.recordset[0].user_email,
                    type: result.recordset[0].user_type,
                    isSuperAdmin: result.recordset[0].user_is_superadmin,
                  },
                  process.env.JWT_LOGIN_SECRET_KEY
                );
                const refreshToken = jwt.sign(
                  {
                    id: result.recordset[0].user_dtls_id,
                    email: result.recordset[0].user_email,
                    type: result.recordset[0].user_type,
                    isSuperAdmin: result.recordset[0].user_is_superadmin,
                  },
                  process.env.JWT_REFRESH_TOKEN
                );
                return res.json({
                  success: {
                    id: result.recordset[0].user_dtls_id,
                    email: result.recordset[0].user_email,
                    firstname: result.recordset[0].user_firstname,
                    lastname: result.recordset[0].user_lastname,
                    type: result.recordset[0].user_type,
                    role: result.recordset[0].user_is_superadmin,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                  },
                });
              } else {
                return res.json({
                  wrong: "Sorry you entered incorrect password",
                });
              }
            }
          );
        } else {
          return res.json({
            notFound: "There is no account with that email address, user type!",
          });
        }
      }
    );
  });
}
// forgot password
export async function forgotPassword(req, res) {
  const email = req.body.email;
  if (!email) return;
  const lowEmail = email.toLowerCase();
  sql.connect(config, async (err) => {
    if (err) return res.send(err.message);
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    request.query(
      "select * from users_dtls where user_email = @email",
      (err, result) => {
        if (err) {
          return res.send({ error: err.message });
        }
        if (result.recordset.length === 0) {
          res.send({
            error:
              "There is no account with this email address. Please sign up!",
          });
        }
        if (result.recordset.length > 0) {
          const forgotPasswordToken = jwt.sign(
            {
              id: result.recordset[0].user_dtls_id,
              email: result.recordset[0].user_email,
              type: result.recordset[0].user_type,
            },
            process.env.JWT_FORGOT_PASSWORD_TOKEN,
            { expiresIn: "15m" }
          );
          const url = `${process.env.FRONT_END_LINK}/user/activate/reset-password/${forgotPasswordToken}`;
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = sendEmail(
            email,
            url,
            "Forgot Password link",
            "Click to reset password"
          );
          sgMail
            .send(msg)
            .then(() => {
              res.send({
                success:
                  "Email has been sent to your register account,Link will be expired in 10 minutes",
              });
            })
            .catch((error) => {
              res.send({ error: "There was an error sending the link" });
            });
        }
      }
    );
  });
}

export async function resetPassword(req, res) {
  const password = req.body.password;
  if (!password) {
    return res.json({ error: "The password must be required" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_TOKEN, (err, user) => {
        if (!err) {
          sql.connect(config, async (err) => {
            if (err) return res.send(err.message);
            const request = new sql.Request();
            request.input("id", sql.Int, user.id);
            request.query(
              "select * from users_dtls where user_dtls_id = @id",
              (err, result) => {
                if (err) {
                  return res.send({ error: err.message });
                }
                if (result.recordset.length === 0) {
                  res.send({
                    error:
                      "There is no account with this email address. Please sign up!",
                  });
                }
                if (result.recordset.length > 0) {
                  const email = result.recordset[0].user_email;
                  sql.connect(config, async (err) => {
                    if (err) return res.send(err.message);
                    const request = new sql.Request();
                    request.input("id", sql.Int, user.id);
                    request.input("password", sql.VarChar, hashedPassword);
                    request.query(
                      "update users_dtls set user_pwd= @password where user_dtls_id= @id",
                      (err, response) => {
                        if (err) return res.send(err.message);
                        if (response) {
                          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                          const msg = updateEmail(
                            email,
                            "Changed password",
                            "changePassword, Please login again!"
                          );
                          sgMail
                            .send(msg)
                            .then(() => {
                              res.send({
                                success: "Successfully changed the password",
                              });
                            })
                            .catch((error) => {
                              res.send({
                                error:
                                  "There was an error updating the password",
                              });
                            });
                        } else {
                          res.send({
                            error: "There was an error updating the password",
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
          return res.send({ token: "link is invalid or expired" });
        }
      });
    } else {
      return res.send({ token: "You are not authenticated" });
    }
  } catch (error) {
    res.send(error.message);
  }
}
// in profile part
export async function changePassword(req, res) {
  const id = req.params.id;
  const password = req.body.password;
  const email = req.body.email;
  if (!password) {
    res.send({ required: "The password must be required" });
  }
  const saltRounds = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    sql.connect(config, async (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from users_dtls where user_dtls_id = @id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            sql.connect(config, async (err) => {
              if (err) return res.send(err.message);
              const request = new sql.Request();
              request.input("id", sql.Int, id);
              request.input("password", sql.VarChar, hashedPassword);
              request.query(
                "update users_dtls set user_pwd= @password where user_dtls_id= @id",
                (err, response) => {
                  if (err) return res.send(err.message);
                  if (response) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = updateEmail(
                      email,
                      "Changed the password",
                      "Changed the password, Please login again"
                    );
                    sgMail
                      .send(msg)
                      .then(() => {
                        return res.send({
                          success: "Successfully Changed the password",
                        });
                      })
                      .catch((error) => {
                        return res.send({
                          error: "There was an error updating the password",
                        });
                      });
                  } else {
                    return res.send({
                      error: "There was an error updating the password",
                    });
                  }
                }
              );
            });
          }
        }
      );
    });
    // connection.query(
    //   "SELECT * FROM user_dtls WHERE user_dtls_id =?",
    //   [id],
    //   (err, user) => {
    //     if (user) {
    //       connection.query(
    //         "UPDATE user_dtls SET user_pwd=? WHERE user_dtls_id=?",
    //         [hashedPassword, id],
    //         (err, response) => {
    //           if (response) {
    //             res.send({ success: "Successfully updated the password" });
    //           } else {
    //             res.send(error.message);
    //           }
    //         }
    //       );
    //     }
    //   }
    // );
  } catch (error) {
    res.send(error.message);
  }
}

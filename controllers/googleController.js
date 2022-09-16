import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import updateEmail from "../middleware/updateEmail.js";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function googleSignUp(req, res, next) {
  try {
    let tokenId = req.body.tokenId;
    let type = req.body.type;
    let password = "Password123";
    let saltRounds = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, saltRounds);
    client
      .verifyIdToken({
        idToken: tokenId,
        audience:
          "891191045055-s1oqh8ebas7ul36fh4lvvm4ejg1m8fb5.apps.googleusercontent.com",
      })
      .then((response) => {
        let { email_verified, email, name } = response.getPayload();
        let firstName = name.split(" ")[0];
        let lastName = name.split(" ")[1];
        if (email_verified) {
          if (email) {
            sql.connect(config, async (err) => {
              if (err) {
                res.send(err.message);
              }
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.input("type", sql.VarChar, type);
              request.query(
                "select * from mentor_dtls where mentor_email = @email",
                (err, result) => {
                  if (err) return res.send({ error: err.message });
                  if (result.recordset.length > 0) {
                    request.query(
                      "select * from users_dtls where user_email = @email AND user_type = @type",
                      (err, result) => {
                        if (result.recordset.length > 0) {
                          const accessToken = jwt.sign(
                            {
                              id: result.recordset[0].user_dtls_id,
                              email: result.recordset[0].user_email,
                              type: result.recordset[0].user_type,
                              isSuperAdmin:
                                result.recordset[0].user_is_superadmin,
                            },
                            process.env.JWT_LOGIN_SECRET_KEY
                          );
                          const refreshToken = jwt.sign(
                            {
                              id: result.recordset[0].user_dtls_id,
                              email: result.recordset[0].user_email,
                              type: result.recordset[0].user_type,
                              isSuperAdmin:
                                result.recordset[0].user_is_superadmin,
                            },
                            process.env.JWT_REFRESH_TOKEN
                          );
                          return res.json({
                            found: {
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
                        }
                      }
                    );
                  } else {
                    request.query(
                      `select * from users_dtls where user_email = @email AND user_type = @type`,
                      (err, result) => {
                        if (result.recordset.length > 0) {
                          const accessToken = jwt.sign(
                            {
                              id: result.recordset[0].user_dtls_id,
                              email: result.recordset[0].user_email,
                              type: result.recordset[0].user_type,
                              isSuperAdmin:
                                result.recordset[0].user_is_superadmin,
                            },
                            process.env.JWT_LOGIN_SECRET_KEY
                          );
                          const refreshToken = jwt.sign(
                            {
                              id: result.recordset[0].user_dtls_id,
                              email: result.recordset[0].user_email,
                              type: result.recordset[0].user_type,
                              isSuperAdmin:
                                result.recordset[0].user_is_superadmin,
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
                          var timestamp = moment(Date.now()).format(
                            "YYYY-MM-DD HH:mm:ss"
                          );
                          sql.connect(config, async (err) => {
                            if (err) res.send(err.message);
                            const request = new sql.Request();
                            request.query(
                              "insert into users_dtls (user_email,user_pwd,user_logindate,user_logintime,user_firstname,user_lastname,user_creation,user_type) VALUES('" +
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
                                timestamp +
                                "','" +
                                type +
                                "' )",
                              (err, success) => {
                                if (err) {
                                  return res.send({ error: err.message });
                                }
                                if (success) {
                                  sgMail.setApiKey(
                                    process.env.SENDGRID_API_KEY
                                  );
                                  const msg = updateEmail(
                                    email,
                                    "Account created successfully",
                                    "Created an account, You are ready to start using our platform."
                                  );
                                  sgMail
                                    .send(msg)
                                    .then(() => {
                                      sql.connect(config, async (err) => {
                                        if (err) {
                                          res.send(err.message);
                                        }
                                        const request = new sql.Request();
                                        request.input(
                                          "email",
                                          sql.VarChar,
                                          email
                                        );
                                        request.input(
                                          "type",
                                          sql.VarChar,
                                          type
                                        );
                                        request.query(
                                          `select * from users_dtls where user_email = @email AND user_type = @type`,
                                          (err, result) => {
                                            if (result.recordset.length > 0) {
                                              const accessToken = jwt.sign(
                                                {
                                                  id: result.recordset[0]
                                                    .user_dtls_id,
                                                  email:
                                                    result.recordset[0]
                                                      .user_email,
                                                  type: result.recordset[0]
                                                    .user_type,
                                                  isSuperAdmin:
                                                    result.recordset[0]
                                                      .user_is_superadmin,
                                                },
                                                process.env.JWT_LOGIN_SECRET_KEY
                                              );
                                              const refreshToken = jwt.sign(
                                                {
                                                  id: result.recordset[0]
                                                    .user_dtls_id,
                                                  email:
                                                    result.recordset[0]
                                                      .user_email,
                                                  type: result.recordset[0]
                                                    .user_type,
                                                  isSuperAdmin:
                                                    result.recordset[0]
                                                      .user_is_superadmin,
                                                },
                                                process.env.JWT_REFRESH_TOKEN
                                              );
                                              return res.json({
                                                success: {
                                                  id: result.recordset[0]
                                                    .user_dtls_id,
                                                  email:
                                                    result.recordset[0]
                                                      .user_email,
                                                  firstname:
                                                    result.recordset[0]
                                                      .user_firstname,
                                                  lastname:
                                                    result.recordset[0]
                                                      .user_lastname,
                                                  type: result.recordset[0]
                                                    .user_type,
                                                  role: result.recordset[0]
                                                    .user_is_superadmin,
                                                  accessToken: accessToken,
                                                  refreshToken: refreshToken,
                                                },
                                              });
                                            } else {
                                              return res.json({
                                                notFound:
                                                  "There is no account with that email address, user type!",
                                              });
                                            }
                                          }
                                        );
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
                  }
                }
              );
            });
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (error) {
    console.log(error);
  }
}

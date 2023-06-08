import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import {
  adminApproveEmail,
  adminDisApproveEmail,
} from "../../middleware/authEmailTemplate.js";

// get all users in the admin dash board
export async function getAllTheUsersData(req, res, next) {
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.query(
        "SELECT * FROM users_dtls ORDER BY user_dtls_id DESC",
        (err, result) => {
          if (err)
            return res.send(
              "There is something went wrong. Please try again later."
            );
          if (result.recordset.length > 0) {
            res.send({ users: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send("There is something went wrong. Please try again later.");
  }
}

// approve
export async function updateAdminApprove(req, res, next) {
  const paramsId = req.params.id;
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.input("id", sql.Int, paramsId);
      request.query(
        "SELECT user_dtls_id from users_dtls WHERE user_dtls_id = @id",
        (err, result) => {
          if (err)
            return res.send(
              "There is something went wrong. Please try again later."
            );
          if (result.recordset.length > 0) {
            const admin = result.recordset[0].user_is_superadmin;
            const email = result.recordset[0].user_email;
            const fullname =
              result.recordset[0].user_firstname +
              " " +
              result.recordset[0].user_lastname;
            if (admin === 0) {
              const admin = 1;
              const request = new sql.Request();
              request.input("admin", sql.Int, admin);
              request.input("id", sql.Int, paramsId);

              const sqlUpdate =
                "UPDATE users_dtls SET user_is_superadmin =@admin WHERE user_dtls_id= @id ";
              request.query(sqlUpdate, (err, result) => {
                if (err)
                  return res.send(
                    "There is something went wrong. Please try again later."
                  );
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = adminApproveEmail(email, fullname);
                  sgMail
                    .send(msg)
                    .then(() => {
                      res.send({
                        success:
                          "Successfully approved as admin in the Practilearn",
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
            res.send({ error: "No user found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send("There is something went wrong. Please try again later.");
  }
}

//disapproved
export async function updateAdminDisapprove(req, res, next) {
  const paramsId = req.params.id;
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.input("id", sql.Int, paramsId);
      request.query(
        "SELECT user_dtls_id FROM users_dtls WHERE  user_dtls_id = @id",
        (err, result) => {
          if (err)
            return res.send(
              "There is something went wrong. Please try again later."
            );
          if (result.recordset.length > 0) {
            const admin = result.recordset[0].user_is_superadmin;
            const email = result.recordset[0].user_email;
            const fullname =
              result.recordset[0].user_firstname +
              " " +
              result.recordset[0].user_lastname;
            if (admin === 1) {
              const notAdmin = 0;
              const request = new sql.Request();
              request.input("notAdmin", sql.Int, notAdmin);
              request.input("id", sql.Int, paramsId);
              const sqlUpdate =
                "UPDATE users_dtls SET user_is_superadmin =@notAdmin WHERE user_dtls_id= @id ";
              request.query(sqlUpdate, (err, result) => {
                if (err)
                  return res.send(
                    "There is something went wrong. Please try again later."
                  );
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = adminDisApproveEmail(email, fullname);
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
            res.send({
              error: "No user found",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send("There is something went wrong. Please try again later.");
  }
}

export async function getAllTraineeUsersData(req, res, next) {
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.query(
        "SELECT user_type FROM users_dtls where user_type = 'member' ORDER BY user_dtls_id DESC",
        (err, result) => {
          if (err)
            return res.send(
              "There is something went wrong. Please try again later."
            );
          if (result.recordset.length > 0) {
            let userData = [];
            result.recordset?.forEach((user) => {
              let data = {
                userDtlsId: user.user_dtls_id,
                userEmail: user.user_email,
                userName: user.user_firstname + " " + user.user_lastname,
                userPhone: user.user_phone_number,
                userType: user.user_type,
              };
              userData.push(data);
            });
            return res.send(userData);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    return res.send("There is something went wrong. Please try again later.");
  }
}

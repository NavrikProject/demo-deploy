import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";

// get all users in the admin dash board
export async function getAllTheUsersData(req, res, next) {
  try {
    sql.connect(config, (err) => {
      const request = new sql.Request();
      request.query(
        "SELECT * FROM users_dtls ORDER BY user_dtls_id DESC",
        (err, result) => {
          if (err) res.send(err.message);
          if (result.recordset.length > 0) {
            res.send({ users: result.recordset });
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    if (error) res.send(error.message);
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
        "SELECT * FROM users_dtls WHERE  user_dtls_id = @id",
        (err, result) => {
          if (err) res.send(err.message);
          if (result.recordset.length > 0) {
            const admin = result.recordset[0].user_is_superadmin;
            const email = result.recordset[0].user_email;
            if (admin === 0) {
              const admin = 1;
              const request = new sql.Request();
              request.input("admin", sql.Int, admin);
              request.input("id", sql.Int, paramsId);

              const sqlUpdate =
                "UPDATE users_dtls SET user_is_superadmin =@admin WHERE user_dtls_id= @id ";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = {
                    from: "no-reply@practilearn.com",
                    to: email,
                    subject: "Admin approve email",
                    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Elevation Training Programme</h2>
                          <p>Congratulations! You're now approved as the admin.
                          </p>
                          Do not reply this email address
                          </div>`,
                  };
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
            res.send("No user found");
          }
        }
      );
    });
  } catch (error) {
    if (error) res.send(error.message);
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
        "SELECT * FROM users_dtls WHERE  user_dtls_id = @id",
        (err, result) => {
          if (err) res.send(err.message);
          if (result.recordset.length > 0) {
            const admin = result.recordset[0].user_is_superadmin;
            const email = result.recordset[0].user_email;
            if (admin === 1) {
              const notAdmin = 0;
              const request = new sql.Request();
              request.input("notAdmin", sql.Int, notAdmin);
              request.input("id", sql.Int, paramsId);
              const sqlUpdate =
                "UPDATE users_dtls SET user_is_superadmin =@notAdmin WHERE user_dtls_id= @id ";
              request.query(sqlUpdate, (err, result) => {
                if (err) return res.send(err.message);
                if (result) {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  const msg = {
                    from: "no-reply@practilearn.com",
                    to: email,
                    subject: "Admin disapprove emails",
                    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Elevation Training Programme</h2>
                          <p>Congratulations! You're no longer than admin our platform
                          </p>
                          Do not reply this email address
                          </div>`,
                  };
                  sgMail
                    .send(msg)
                    .then(() => {
                      res.send({
                        success:
                          "Successfully disapproved as admin in the Elevashun",
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

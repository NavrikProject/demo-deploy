import moment from "moment";
import sql from "mssql";
import config from "../config/dbconfig.js";
import sgMail from "@sendgrid/mail";

//get all trainers in dashboard section
export function getAllTrainerDetails(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query(
        "select * from  trainer_details_approve order by trainer_details_id DESC",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

// approve trainer
export function updateTrainerApprove(req, res, next) {
  const id = req.body.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from trainer_details_approve WHERE trainer_details_id= @id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const approveRow = result.recordset[0].trainer_approve;
            const email = result.recordset[0].trainer_email;

            if (approveRow === "no") {
              sql.connect(config, (err) => {
                if (err) return res.send(err.message);
                const request = new sql.Request();
                request.input("id", sql.Int, id);
                let approve = "yes";
                request.input("approve", sql.VarChar, approve);
                request.query(
                  "UPDATE trainer_details_approve SET trainer_approve= @approve WHERE trainer_details_id=@id",
                  (err, result) => {
                    if (err) return res.send(err.message);
                    if (result) {
                      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                      const msg = {
                        to: email, // Change to your recipient
                        from: "no-reply@practilearn.com", // Change to your verified sender
                        subject: "Trainer approve emails",
                        html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the PractiLearn Training Programme</h2>
                    <p>Congratulations! You're almost set to start using our Platform .
                        You are now approved as trainer in the PractiLearn Programme please contact us through this email address.
                    </p>
                    Do not reply this email address
                    </div>`,
                      };
                      sgMail
                        .send(msg)
                        .then(() => {
                          return res.send({
                            approved: "The trainer has been approved",
                          });
                        })
                        .catch((error) => {
                          res.send(error);
                        });
                    }
                  }
                );
              });
            } else {
              return res.send("The trainer has all ready approved");
            }
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

// disapprove trainer route
export function updateTrainerDisApprove(req, res, next) {
  const id = req.body.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from trainer_details_approve WHERE trainer_details_id= @id",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const approveRow = result.recordset[0].trainer_approve;
            const email = result.recordset[0].trainer_email;
            if (approveRow === "yes") {
              sql.connect(config, (err) => {
                if (err) return res.send(err.message);
                const request = new sql.Request();
                request.input("id", sql.Int, id);
                let disapprove = "no";
                request.input("disapprove", sql.VarChar, disapprove);
                request.query(
                  "UPDATE trainer_details_approve SET trainer_approve= @disapprove WHERE trainer_details_id=@id",
                  (err, result) => {
                    if (err) return res.send(err.message);
                    if (result) {
                      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                      const msg = {
                        to: email, // Change to your recipient
                        from: "no-reply@practilearn.com", // Change to your verified sender
                        subject: "Trainer rejection emails",
                        html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the PractiLearn Training Programme</h2>
                      <p>Hello Hope you are doing well with your works this email about the status of a application about trainer in the PractiLearn Programme ,You have not met our criteria you are not eligible for this trainer post.Thank you for applying.
                      </p>
                      Do not reply this email address
                      </div>`,
                      };
                      sgMail
                        .send(msg)
                        .then(() => {
                          return res.send({
                            disapproved: "The trainer has been disapproved",
                          });
                        })
                        .catch((error) => {
                          res.send(error);
                        });
                    }
                  }
                );
              });
            } else {
              res.send("The trainer has all ready diapproved");
            }
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

export async function getTrainerDetailsApproveOrNot(req, res, next) {
  const email = req.body.email;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "SELECT * FROM trainer_details_approve WHERE trainer_email=@email",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          }
        }
      );
    });
  } catch (error) {
    res.send(error.message);
  }
}

// // update the trainer detailsFlex need to write code
// export async function updateTechnicalDetails(req, res) {
//   try {
//     sql.connect(config, (err) => {
//       if (err) return res.send(err.message);
//       const request = new sql.Request();
//       request.query("", (err, result) => {
//         if (err) return res.send(err.message);
//         if (result.recordset.length > 0) {
//           res.send(result.recordset);
//         }
//       });
//     });
//   } catch (error) {
//     res.send(error.message);
//   }
// }

// in navbar
export async function getOnlyTrainerDetails(req, res) {
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
                "SELECT * FROM trainer_details_approve WHERE trainer_email =@email",
                (err, result) => {
                  if (err) return res.send(err.message);
                  if (result.recordset.length > 0) {
                    const approved = result.recordset[0].trainer_approve;
                    if (approved === "yes") {
                      res.send({
                        approved: approved,
                      });
                    } else {
                      res.send({
                        disapproved: "not approved",
                      });
                    }
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

export async function getAllTrainersDetailsInTrainers(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query("SELECT * FROM trainer_profile", (err, result) => {
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

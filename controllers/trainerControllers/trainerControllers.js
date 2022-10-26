import sql from "mssql";
import config from "../../config/dbconfig.js";
import sgMail from "@sendgrid/mail";
import {
  trainerApproveEmail,
  trainerDisApproveEmail,
} from "../../middleware/trainerEmailTemplates.js";

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
            const fullname =
              result.recordset[0].trainer_firstname +
              " " +
              result.recordset[0].trainer_lastname;
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
                      const msg = trainerApproveEmail(email, fullname);
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
            const fullname =
              result.recordset[0].trainer_firstname +
              " " +
              result.recordset[0].trainer_lastname;
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
                      const msg = trainerDisApproveEmail(email, fullname);
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

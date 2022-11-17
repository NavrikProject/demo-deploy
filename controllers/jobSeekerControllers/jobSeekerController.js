import config from "../../config/dbconfig.js";
import sql from "mssql";

export async function getAllAppliedJobByUser(req, res, next) {
  const userDtlsId = req.params.id;
  const userEmail = req.body.userEmail;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.input("userEmail", sql.VarChar, userEmail);
      request.query(
        "select * from job_post_master where apply_job_master_user_dtls_id = @userDtlsId and apply_job_master_email = @userEmail",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: " " });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

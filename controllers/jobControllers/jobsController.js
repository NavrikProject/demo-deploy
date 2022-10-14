import sql from "mssql/msnodesqlv8.js";
import config from "../../config/dbconfig.js";

export async function getAllJobDetails(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from job_post_dtls where job_post_status = 'active' ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

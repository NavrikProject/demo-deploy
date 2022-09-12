import sql from "mssql";
import config from "../config/dbconfig.js";

export function corpCourseControllers(req, res, next) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send(err.message);
      const request = new sql.Request();
      request.query("select * from corporate_courses_dtls", (err, result) => {
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

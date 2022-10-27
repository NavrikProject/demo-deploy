import sql from "mssql";
import config from "../../config/dbconfig.js";
import dotenv from "dotenv";
dotenv.config();

export async function getTraineeInCompleteCourses(req, res) {
  const email = req.body.email;

  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ err: err.message });
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        "select * from trainee_courses_dtls where trainee_course_email = @email and trainee_course_complete_status = 'incomplete'",
        (err, result) => {
          if (err) return res.send({ err: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: "" });
  }
}

export async function getTraineeCompleteCourses(req, res) {
  const userEmail = req.body.email;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ err: err.message });
      const request = new sql.Request();
      request.input("userEmail", sql.VarChar, userEmail);
      request.query(
        "select * from trainee_courses_dtls where trainee_course_email = @userEmail and trainee_course_complete_status = 'complete' ",
        (err, result) => {
          if (err) return res.send({ err: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: "" });
  }
}

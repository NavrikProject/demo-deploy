import sql from "mssql";
import config from "../config/dbconfig.js";

export function getTransactionalDetails(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (error) => {
      if (error) {
        res.send(error);
      }
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query("select * from users_dtls where id= @id", (err, result) => {
        if (err) res.send(err);
        if (result.recordset.length > 0) {
          const email = result.recordset[0].user_email;
        }
      });
    });
  } catch (error) {
    if (error) {
      res.send(error.message);
    }
  }
}

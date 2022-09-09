import config from "../config/dbConfig.js";
import sql from "mssql";

export const homeRoute = (req, res) => {
  const time = new Date().getTime();
  return res.send({
    message: `The server is working on fine with this time ${time} and date ${new Date().toDateString()}`,
  });
};

export const getUsers = (req, res) => {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query("SELECT * FROM users_dtls", (err, result) => {
        if (err) return res.send(err.message);
        if (result.recordset.length > 0) {
          return res.send(result.recordset);
        } else {
          return res.send({ error: "No users found" });
        }
      });
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

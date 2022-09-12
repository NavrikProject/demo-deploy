import config from "../config/dbConfig.js";
import sql from "mssql";

export const homeRoute = (req, res) => {
  const time = new Date().getTime();
  // return res.send({
  //   message: `The server is working on fine with this time ${time} and date ${new Date().toDateString()}`,
  // });
  fs.writeFileSync(
    `${__dirname}/mnt/testing/mynewfile2.txt`,
    "w",
    "Hello world"
  );

  fs.close();
  fs.readFileSync(
    `${__dirname}/mnt/testing/mynewfile2.txt`,
    "utf8",
    function (err, result) {
      return res.json(result);
    }
  );
};

export const getUsers = (req, res) => {
  try {
    sql.connect(config, (err, connection) => {
      if (err) return res.send({ error: err.message });
      return res.send({
        message: `The database connection is successful and it is ${connection._connected} and it is connected to the ${config.user} and ${config.database}`,
      });
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

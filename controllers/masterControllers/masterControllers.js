import sql from "mssql";
import config from "../../config/dbconfig.js";

export async function getMasterSkills(req, res, next) {
  const category = req.query.name;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("category", sql.VarChar, category);
      request.query(
        "select * from skills_master where skill_master_category_name = @category",
        (err, result) => {
          if (err)
            return res.send({
              error: err.message,
            });
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          }
        }
      );
    });
  } catch (error) {}
}

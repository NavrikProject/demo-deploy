import sql from "mssql";
import config from "../../config/dbconfig.js";

// in home job screen
export async function getAllJobDetails(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from hiring_company_dtls join job_post_dtls on hiring_company_dtls.hiring_company_dtls_id = job_post_dtls.hiring_company_dtls_id where job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' order by job_post_dtls_id DESC ",
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

// get individual job details in individual page
export async function getIndividualJobDetails(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("uniqueId", sql.VarChar, id);
      request.query(
        "select * from hiring_company_dtls join job_post_dtls on hiring_company_dtls.hiring_company_dtls_id = job_post_dtls.hiring_company_dtls_id where job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' and job_post_unique_id = @uniqueId ",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            return res.send({ success: result.recordset });
          } else {
            return res.send({ error: "Job details not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}
export async function getJobBySearch(req, res) {
  const searchQuery = req.query;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("searchQuery", sql.VarChar, searchQuery.skills);
      request.input("experience", sql.VarChar, searchQuery.experience);
      request.input("location", sql.VarChar, searchQuery.location);
      if (
        !searchQuery.skills &&
        !searchQuery.experience &&
        !searchQuery.location
      ) {
        return res.send({ error: "Not found" });
      }
      if (
        searchQuery.skills &&
        !searchQuery.experience &&
        !searchQuery.location
      ) {
        var sqlSearchQuery =
          "select * from hiring_company_dtls join job_post_dtls on hiring_company_dtls.hiring_company_dtls_id = job_post_dtls.hiring_company_dtls_id where job_post_req_skills like '%' + @searchQuery + '%' and job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' ";
      }
      if (
        !searchQuery.skills &&
        searchQuery.experience &&
        !searchQuery.location
      ) {
        var sqlSearchQuery =
          "select * from hiring_company_dtls join job_post_dtls on hiring_company_dtls.hiring_company_dtls_id = job_post_dtls.hiring_company_dtls_id where and job_post_min_exp = @experience and job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' ";
      }
      if (
        !searchQuery.skills &&
        !searchQuery.experience &&
        searchQuery.location
      ) {
        var sqlSearchQuery =
          "select * from hiring_company_dtls join job_post_dtls on hiring_company_dtls.hiring_company_dtls_id = job_post_dtls.hiring_company_dtls_id where hiring_company_city = @location and job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' ";
      }
      if (
        searchQuery.skills &&
        searchQuery.experience &&
        searchQuery.location
      ) {
        var sqlSearchQuery =
          "select * from hiring_company_dtls join job_post_dtls on hiring_company_dtls.hiring_company_dtls_id = job_post_dtls.hiring_company_dtls_id where job_post_req_skills like '%' + @searchQuery + '%' and job_post_min_exp = @experience and hiring_company_city = @location and job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' ";
      }
      request.query(sqlSearchQuery, (err, result) => {
        if (err) return res.send({ error: err.message });
        if (result.recordset.length > 0) {
          return res.send({ success: result.recordset });
        } else {
          return res.send({ error: "Not found" });
        }
      });
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}
// for admin
export async function getAllInActiveJobDetailsInAdmin(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from job_post_dtls where job_post_status = 'inactive' and job_post_approve_status = 'no' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' order by job_post_dtls_id DESC",
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
export async function getAllActiveJobDetailsInAdmin(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.query(
        "select * from job_post_dtls where job_post_status = 'active' and job_post_approve_status = 'yes' and job_post_hiring_status ='hiring' and job_post_open_position_status = 'open' order by job_post_dtls_id DESC ",
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
export async function updateJobPostToActiveState(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from job_post_dtls where job_post_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            const sqlUpdate =
              "update job_post_dtls set job_post_status ='active', job_post_approve_status ='yes' where job_post_dtls_id = @id";
            request.query(sqlUpdate, (err, result) => {
              if (err) return res.send({ error: err.message });
              if (result) {
                return res.send({ success: "Successful approved the job" });
              } else
                return res.send({
                  error: "There was an error updating the job",
                });
            });
          } else {
            res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}
export async function updateJobPostToInActiveState(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: err.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from job_post_dtls where job_post_dtls_id = @id",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            const sqlUpdate =
              "update job_post_dtls set job_post_status ='inactive', job_post_approve_status ='no' where job_post_dtls_id = @id";
            request.query(sqlUpdate, (err, result) => {
              if (err) return res.send({ error: err.message });
              if (result) {
                return res.send({
                  success: "Successfully job is post is disapproved",
                });
              } else
                return res.send({
                  error: "There was an error updating the job",
                });
            });
          } else {
            res.send({ error: "Not found" });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

import sql from "mssql";
import config from "../config/dbconfig.js";
import azureStorage from "azure-storage";
import intoStream from "into-stream";
import dotenv from "dotenv";

const containerName = "navrikimage";

dotenv.config();

const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

// adding  a new course route && need to tested
export async function createNewCourse(req, res) {
  const id = req.params.id;
  const courseName = req.body.courseName;
  const price = req.body.price;
  const category = req.body.category;
  const tags = req.body.tags;
  let startsDate = req.body.startsDate;
  let endsDate = req.body.endsDate;
  const title = req.body.title;
  const link = req.body.spayeeLink;
  const duration = 4;
  let creationDate = new Date().toLocaleDateString().toString();
  const participants = 20;
  const createdBy = "Navrik Team";
  const description = req.body.description;
  console.log(creationDate);
  const blobName = new Date().getTime() + "-" + req.files.image.name;

  let fileName = `https://navrik.blob.core.windows.net/navrikimage/${blobName}`;

  const stream = intoStream(req.files.image.data);
  const streamLength = req.files.image.data.length;

  blobService.createBlockBlobFromStream(
    containerName,
    blobName,
    stream,
    streamLength,
    (err) => {
      if (err) {
        res.status(500);
        res.send({ error: "Error Occurred" });
        return;
      }
      if (!err) {
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
                  const firstName = result.recordset[0].user_firstname;
                  const lastName = result.recordset[0].user_lastname;
                  const trainerName = firstName + " " + lastName;
                  sql.connect(config, (err) => {
                    if (err) return res.send(err.message);
                    const request = new sql.Request();
                    request.input("email", sql.VarChar, email);
                    request.query(
                      "SELECT * FROM  trainer_profile WHERE trainer_email = @email",
                      (err, result) => {
                        if (err) return res.send(err.message);
                        if (result.recordset.length > 0) {
                          const experience =
                            result.recordset[0].trainer_exp_yrs;
                          const skills = result.recordset[0].trainer_skills;
                          const image = result.recordset[0].trainer_image;
                          const trainerId =
                            result.recordset[0].trainer_profile_id;
                          sql.connect(config, (err) => {
                            if (err) return res.send({ error: error.message });
                            const request = new sql.Request();
                            request.query(
                              "INSERT INTO courses_dtls (course_name, course_price, course_title,course_duration,course_cr_date, course_start_dt,course_end_dt, course_participants,course_category,course_created_by,course_trainer_name,course_tags,course_spayee_link,course_image,course_desc,course_trainer_profile_id,course_trainer_exp,course_trainer_skills,course_trainer_image) VALUES('" +
                                courseName +
                                "','" +
                                price +
                                "','" +
                                title +
                                "','" +
                                duration +
                                "','" +
                                creationDate +
                                "', '" +
                                startsDate +
                                "','" +
                                endsDate +
                                "', '" +
                                participants +
                                "','" +
                                category +
                                "','" +
                                createdBy +
                                "','" +
                                trainerName +
                                "','" +
                                tags +
                                "','" +
                                link +
                                "','" +
                                fileName +
                                "','" +
                                description +
                                "','" +
                                trainerId +
                                "','" +
                                experience +
                                "','" +
                                skills +
                                "','" +
                                image +
                                "')",
                              (err, result) => {
                                if (err) return res.send(err.message);
                                if (result) {
                                  return res.send({
                                    success:
                                      "The course was successfully added.",
                                  });
                                } else {
                                  return res.send({
                                    error: err.message,
                                  });
                                }
                              }
                            );
                          });
                        } else {
                          res.send({
                            error: "Please update you trainer profile details",
                          });
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
    }
  );
}

// get all the course the user is
export function getAllTheCourses(req, res) {
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
      const request = new sql.Request();
      request.query(
        "SELECT * FROM courses_dtls ORDER BY course_id DESC",
        (err, result) => {
          if (err) return res.send({ error: err.message });
          if (result.recordset.length > 0) {
            res.send(result.recordset);
          } else {
            return;
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

// editing the course
export async function editCourse(req, res) {
  const id = req.params.id;
  const file = req.files.image;
  const courseName = req.body.courseName;
  const price = req.body.price;
  const category = req.body.category;
  const tags = req.body.tags;
  const startsDate = req.body.startsDate;
  const endsDate = req.body.endsDate;
  const title = req.body.title;
  const link = req.body.spayeeLink;
  const duration = 4;
  const creationDate = new Date();
  const participants = 20;
  const createdBy = "Navrik Team";
  const description = req.body.description;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
      const request = new sql.Request();
      request.input("courseName", sql.VarChar, courseName);
      request.input("price", sql.Int, price);
      request.input("duration", sql.Int, duration);
      request.input("title", sql.VarChar, title);
      request.input("creationDate", sql.Date, creationDate);
      request.input("startsDate", sql.Date, startsDate);
      request.input("endsDate", sql.Date, endsDate);
      request.input("participants", sql.Int, participants);
      request.input("category", sql.VarChar, category);
      request.input("createdBy", sql.VarChar, createdBy);
      request.input("tags", sql.VarChar, tags);
      request.input("link", sql.VarChar, link);
      request.input("description", sql.VarChar, description);
      request.input("id", sql.Int, id);
      request.query(
        "UPDATE user_dtls SET course_name=@courseName, course_price=@price, course_title=@title,course_duration=@duration,course_cr_date=@creationDate, course_start_dt=@startsDate,course_end_dt=@endsDate, course_participants=@participants,course_category=@category,course_created_by=@createdBy,course_tags=@tags,course_spayee_link=@link,course_image=?,course_desc=@description WHERE course_id = @id",
        (err, result) => {
          if (err)
            return res.send({
              error: "There was an error while editing the course",
            });
          if (result) {
            return res.send({
              success: "The editing of course was successfully completed.",
            });
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

// deleting the course && working
export async function deleteCourse(req, res) {
  const id = req.params.id;
  try {
    sql.connect(config, (err) => {
      if (err) return res.send({ error: error.message });
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "DELETE FROM courses_dtls WHERE course_id=@id",
        (err, result) => {
          if (err)
            return res.send({
              error: "There was an error while deleting the course",
            });
          if (result) {
            return res.send({
              success: "The course deleted successfully.",
            });
          }
        }
      );
    });
  } catch (error) {
    res.send({ error: error.message });
  }
}

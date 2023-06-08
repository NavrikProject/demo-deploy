import { BlockBlobClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import intoStream from "into-stream";
import sql from "mssql";
import config from "../../config/dbConfig.js";
dotenv.config();
// image upload && working accurately
export async function updateMentorProfileImage(req, res) {
  const id = req.params.id;
  if (!req.files) {
    return res.send({ error: "Please select a file to upload" });
  }
  try {
    sql.connect(config, (error) => {
      if (error) {
        res.send(error);
      }
      const request = new sql.Request();
      request.input("id", sql.Int, id);
      request.query(
        "select * from users_dtls where user_dtls_id = @id",
        (err, result) => {
          if (err) res.send(err);
          if (result.recordset.length > 0) {
            const email = result.recordset[0].user_email;
            sql.connect(config, (error) => {
              if (error) {
                res.send(error);
              }
              const request = new sql.Request();
              request.input("email", sql.VarChar, email);
              request.query(
                "SELECT * FROM mentor_dtls WHERE mentor_email = @email",
                (err, result) => {
                  if (err) res.send(err);
                  if (result.recordset.length > 0) {
                    const blobName =
                      new Date().getTime() + "-" + req.files.image.name;
                    const filename = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
                    const blobService = new BlockBlobClient(
                      process.env.AZURE_STORAGE_CONNECTION_STRING,
                      "practiwizcontainer/mentorprofilepictures",
                      blobName
                    );
                    const stream = intoStream(req.files.image.data);
                    const streamLength = req.files.image.data.length;
                    blobService
                      .uploadStream(stream, streamLength)
                      .then((response) => {
                        sql.connect(config, (err) => {
                          if (err) res.send(err.message);
                          const request = new sql.Request();
                          request.input("email", sql.VarChar, email);
                          request.input("fileName", sql.VarChar, filename);
                          request.query(
                            "UPDATE mentor_dtls SET mentor_image = @fileName WHERE mentor_email = @email ",
                            (err, response) => {
                              if (err) {
                                return res.send({
                                  error: "No user found",
                                });
                              }
                              if (response) {
                                return res.send({
                                  upload:
                                    "Profile picture updated successfully",
                                });
                              }
                            }
                          );
                        });
                      })
                      .catch((err) => {
                        return res.send({
                          error: "There was an error uploading",
                        });
                      });
                  } else {
                    res.send({ error: "Please update the trainee details" });
                  }
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {
    if (error) {
      res.send(error.message);
    }
  }
}

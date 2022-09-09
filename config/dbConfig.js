import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.SQL_AZURE_USERNAME,
  password: process.env.SQL_AZURE_PWD,
  database: process.env.SQL_AZURE_DATABASE,
  server: process.env.SQL_AZURE_SERVER,
  // authentication: {
  //   options: {
  //     userName: process.env.SQL_AZURE_USERNAME, // update me
  //     password: process.env.SQL_AZURE_PWD, // update me
  //   },
  //   type: "default",
  // },
  // server: process.env.SQL_AZURE_SERVER, // update me
  // options: {
  //   database: process.env.SQL_AZURE_DATABASE, //update me
  //   encrypt: true,
  //   TrustServerCertificate: false,
  // },
};

export default config;

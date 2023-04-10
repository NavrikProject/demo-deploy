import dotenv from "dotenv";

dotenv.config();

const config = {
  // user: process.env.SQL_AZURE_USERNAME,
  // password: process.env.SQL_AZURE_PWD,
  // database: process.env.SQL_AZURE_DATABASE,
  // server: process.env.SQL_AZURE_SERVER,
  database: "practiwiz",
  server: "MAHESH\\SQLEXPRESS",
  user: "sa",
  password: "12345",
  port: 1443,
  options: {
    trustServerCertificate: true,
  },
};
export default config;

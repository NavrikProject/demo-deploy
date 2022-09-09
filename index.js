import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import HomeRoute from "./routes/indexRoute.js";
dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 1337;
console.log(process.env.SQL_AZURE_USERNAME);
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/", HomeRoute);

app.get("/", (req, res) => {
  const time = new Date().getTime();
  const date = new Date().toDateString();
  return res.send({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});
app.listen(port, () => {
  console.log(`The server is listening on ${port}`);
});

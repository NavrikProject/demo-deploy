import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import HomeRoute from "./routes/indexRoute.js";
dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 1300;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/", HomeRoute);
app.listen(port, () => {
  console.log(`The server is listening on ${port}`);
});

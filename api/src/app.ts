import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectRabbit } from "./config/publisher";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectRabbit();

app.listen(port, () => {
  console.log(`API Gateway запущен на порту ${port}`);
});

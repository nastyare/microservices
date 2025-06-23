import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { startUserConsumer } from "./src/consumer";
import courseRoutes from "./src/routes/courseRoutes"; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/courses";

app.use(express.json());

app.use("/courses", courseRoutes);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Подключено к MongoDB");

    startUserConsumer();
  })
  .catch((err) => {
    console.error("Ошибка подключения к MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Courses Service запущен на порту ${port}`);
});

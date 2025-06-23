import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { startUserConsumer } from "./src/consumer";
import userRoutes from "./src/routes/userRoutes"; 
import authRoutes from "./src/routes/authRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/users";

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes)

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
  console.log(`User Service запущен на порту ${port}`);
});

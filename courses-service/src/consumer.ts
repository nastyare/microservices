import amqp from "amqplib";
import { handleCourseMessage } from "./handlers/courseHandler";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const EXCHANGE_NAME = "app-exchange";
const QUEUE = "course-service";
const ROUTING_KEY = "course-service-routing";

export const startUserConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE_NAME, ROUTING_KEY);

    console.log("course-service слушает очередь:", QUEUE);

    channel.consume(QUEUE, async (msg) => {
      if (msg) {
        await handleCourseMessage(msg);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Ошибка запуска consumer в course-service:", err);
  }
};

startUserConsumer();

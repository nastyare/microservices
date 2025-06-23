import amqp from "amqplib";
import { handleUserMessage } from "./controllers/userController";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const EXCHANGE_NAME = "app-exchange";
const QUEUE = "user-service";
const ROUTING_KEY = "user-service-routing";

export const startUserConsumer = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE_NAME, ROUTING_KEY);

  channel.consume(QUEUE, async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      await handleUserMessage(content); 
      channel.ack(msg);
    }
  });

  console.log("User-service consumer запущен.");
};

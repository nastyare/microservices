import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const EXCHANGE_NAME = "app-exchange";
let channel: amqp.Channel;

export const connectRabbit = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
};

export const publishToUserService = async (routingKey: string, data: object) => {
  if (!channel) await connectRabbit();

  channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });
};

export const publishToCourseService = async (routingKey: string, data: object) => {
  if (!channel) {
    await connectRabbit();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
};

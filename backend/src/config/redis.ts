import "dotenv/config";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

const redisClient = redisUrl
  ? createClient({
      url: redisUrl,
    })
  : null;

if (redisClient) {
  redisClient.on("error", (error) => {
    console.error("Redis error:", error);
  });
}

export async function connectRedis() {
  if (!redisClient) {
    console.log("Redis not configured. Running without Redis cache.");
    return;
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("GREENPULSE Redis connected");
  }
}

export default redisClient;

import { createClient } from "redis";

let client;
let redisAvailable = false;

try {
  client = createClient({
    url: "redis://localhost:6379",
    socket: {
      reconnectStrategy: false, 
    },
  });

  client.on("error", (err) => {
    console.log("⚠️ Redis not available:", err.message);
    redisAvailable = false;
  });

  await client.connect();
  redisAvailable = true;
  console.log("✅ Redis connected");
} catch (err) {
  console.log("⚠️ Failed to connect to Redis:", err.message);
  redisAvailable = false;
}

export { client, redisAvailable };

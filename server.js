// server.js

import express from "express";
import bodyParser from "body-parser";
import redis from "redis";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const client = redis.createClient({
  password: "xVrg8gJBE2v7aHFfpenfVsasRLUUxoRK",
  socket: {
    host: "redis-14279.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 14279,
  },
});

client.on("connect", () => {
  console.log("Connected to Redis server successfully!");
});

client.on("error", (error) => {
  console.error("Redis client encountered an error:", error);
});
(async () => {
  await client.connect();
})();

app.use(cors()); // Add this line to enable CORS
app.use(bodyParser.json());
app.use(cookieParser());

app.set("trust proxy", 1);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const storedPassword = await client.get(username);
  if (storedPassword == password) {
    await client.set("current", username);
    res.status(202).send("Login was successful.");
  } else {
    res.status(401).send("Incorrect username or password.");
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const exists = await client.exists(username);

  if (exists != 1) {
    await client.set(username, password);
    res.status(200).send("User registered successfully.");
  } else {
    res.status(401).send("User already exists with same username.");
  }
});

app.get("/logout", async (req, res) => {
  await client.del("current");
  res.send("Completed");
});

// Route to get session data
app.get("/getSession", async (req, res) => {
  const exists = await client.exists("current");
  if (exists == 1) {
    console.log(exists);
    res.send("1");
  } else {
    res.send("0");
  }
});

app.get("/won", async (req, res) => {
  const username = await client.get("current");
  const a = await client.exists("leader" + username);
  if (!a) {
    await client.set("leader" + username, 1);
  } else {
    await client.incr("leader" + username);
  }
  res.status(200);
});

async function getAllRedisKeysAndValues() {
  try {
    const keys = await client.keys("*");

    const promises = keys.map(async function (key) {
      if (key.includes("leader")) {
        const value = await client.get(key);
        return { key, value };
      }
    });

    const results = await Promise.all(promises);
    const filteredResults = results.filter((result) => result !== undefined);

    // Now you have all the key-value pairs where key includes "leader"
    return filteredResults;
  } catch (error) {
    console.error("Error:", error);
  }
}

app.get("/redis", async (req, res) => {
  try {
    const data = await getAllRedisKeysAndValues();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

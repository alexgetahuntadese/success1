import "dotenv/config";

import cors from "cors";
import express from "express";
import authRouter from './auth/index.js'
import pg from "pg";

const { Pool } = pg;

const {
  PORT = "5000",
  DATABASE_URL,
  JWT_SECRET,
  CLIENT_ORIGIN = "http://localhost:8080",
} = process.env;

if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in server environment.");
}

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in server environment.");
}

const app = express();
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const allowedOrigins = CLIENT_ORIGIN.split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed for this API."));
    },
  }),
);
app.use(express.json());

// Mount auth routes implemented in server/src/auth
app.use('/api/auth', authRouter)

app.get("/api/health", async (_request, response) => {
  try {
    await pool.query("SELECT 1");
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({ ok: false, message: "Database connection failed." });
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);

  if (error?.message === "Origin is not allowed for this API.") {
    response.status(403).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: "Something went wrong on the auth server." });
});

app.listen(Number(PORT), () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});

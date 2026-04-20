import "dotenv/config";

import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import authRouter from './auth/sqliteRoutes.js'
import { uploadRouter, receiptStaticPath } from './auth/payments.js'
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
const httpServer = createServer(app);
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const defaultDevOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = [
  ...defaultDevOrigins,
  ...CLIENT_ORIGIN.split(",").map((value) => value.trim()),
].filter(Boolean);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));

// Mount auth routes implemented in server/src/auth
app.use('/api/auth', authRouter)

// Mount payment routes
app.use('/api/payments', uploadRouter)

// Serve uploaded receipts statically
app.use('/uploads/receipts', express.static(receiptStaticPath))

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

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

httpServer.listen(Number(PORT), () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});

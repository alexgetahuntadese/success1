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
  CLIENT_ORIGIN = "http://localhost:5173",
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

app.post("/api/auth/register", async (request, response) => {
  const fullName = typeof request.body.fullName === "string" ? request.body.fullName.trim() : "";
  const phone = normalizePhoneNumber(request.body.phone);
  const password = typeof request.body.password === "string" ? request.body.password : "";

  if (!fullName) {
    response.status(400).json({ message: "Enter your full name." });
    return;
  }

  if (!phone) {
    response.status(400).json({ message: "Enter a valid phone number." });
    return;
  }

  if (password.length < 6) {
    response.status(400).json({ message: "Use a password with at least 6 characters." });
    return;
  }

  const existingUser = await pool.query("SELECT id FROM users WHERE phone = $1 LIMIT 1", [phone]);
  if (existingUser.rows.length > 0) {
    response.status(409).json({ message: "That phone number is already registered. Try signing in instead." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const insertResult = await pool.query(
    `INSERT INTO users (phone, password_hash, name, preferences, last_login)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [phone, passwordHash, fullName, JSON.stringify({ role: "student" })],
  );

  response.status(201).json(buildAuthResponse(insertResult.rows[0]));
});

app.post("/api/auth/login", async (request, response) => {
  const phone = normalizePhoneNumber(request.body.phone);
  const password = typeof request.body.password === "string" ? request.body.password : "";

  if (!phone || !password) {
    response.status(400).json({ message: "Enter your phone number and password." });
    return;
  }

  const result = await pool.query("SELECT * FROM users WHERE phone = $1 LIMIT 1", [phone]);
  const user = result.rows[0];

  if (!user) {
    response.status(401).json({ message: "No account was found for that phone number." });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    response.status(401).json({ message: "Incorrect phone number or password." });
    return;
  }

  const updateResult = await pool.query(
    `UPDATE users
     SET last_login = NOW(), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [user.id],
  );

  response.json(buildAuthResponse(updateResult.rows[0]));
});

app.get("/api/auth/me", requireAuth, async (request, response) => {
  response.json(buildAuthResponse(request.authUser));
});

app.patch("/api/auth/me", requireAuth, async (request, response) => {
  const name = typeof request.body.name === "string" ? request.body.name.trim() : "";
  const emailRaw = typeof request.body.email === "string" ? request.body.email.trim() : "";
  const email = emailRaw || null;

  if (!name) {
    response.status(400).json({ message: "Enter your full name." });
    return;
  }

  const updateResult = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [name, email, request.authUser.id],
  );

  response.json(buildAuthResponse(updateResult.rows[0]));
});

app.post("/api/auth/logout", (_request, response) => {
  response.json({ ok: true });
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

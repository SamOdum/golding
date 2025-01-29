import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { getEnvVar } from "./utils/env";

const app = express();
const PORT = parseInt(getEnvVar("PORT", "8000"));
const CORS_ORIGIN = getEnvVar("CORS_ORIGIN", "http://localhost:5173");

// Middleware
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Welcome route - serves both HTML and JSON based on Accept header
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.json({
      message: "Welcome to the Authentication API",
      version: "1.0.0",
      endpoints: {
        auth: "/api/login, /api/register, /api/protected",
        health: "/health",
      },
    });
  }
});

// Routes
app.use("/api", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT || '8000';

// Security middleware
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // Limit each IP to 50 requests per windowMs
    message: "Too many requests from this IP, please try again later"
  })
);

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

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

import { Express } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { prisma } from "../lib/prisma";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoutes from "../routes/auth.routes";

function createTestApp(): Express {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", authRoutes);
  return app;
}

const app = createTestApp();

describe("Authentication API", () => {
  const testUser = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "Password123!",
  };

  describe("POST /api/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/register").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body.user).toHaveProperty("email", testUser.email);
      expect(res.body.user).toHaveProperty("firstName", testUser.firstName);
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should not allow duplicate email registration", async () => {
      const res = await request(app).post("/api/register").send(testUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should validate password requirements", async () => {
      const weakPasswordUser = {
        ...testUser,
        email: "weak@example.com",
        password: "123",
      };
      const res = await request(app)
        .post("/api/register")
        .send(weakPasswordUser);

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(res.body.user).toHaveProperty("email", testUser.email);
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /api/protected", () => {
    let authToken: string;

    beforeAll(async () => {
      // Create a test token
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      authToken = jwt.sign(
        { id: user?.id, email: user?.email },
        process.env.JWT_SECRET || "top-secret-key",
        { expiresIn: "24h" }
      );
    });

    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .get("/api/protected")
        .set("Cookie", [`token=${authToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("email", testUser.email);
    });

    it("should fail to access protected route without token", async () => {
      const res = await request(app).get("/api/protected");

      expect(res.status).toBe(401);
    });

    it("should fail to access protected route with invalid token", async () => {
      const res = await request(app)
        .get("/api/protected")
        .set("Cookie", ["token=invalid_token"]);

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/logout", () => {
    it("should clear the auth token cookie", async () => {
      const res = await request(app).post("/api/logout");

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
    });
  });
});

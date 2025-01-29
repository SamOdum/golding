import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { CookieOptions } from "../types";
import { loginSchema, RegisterSchema } from "../validations";

const JWT_SECRET = process.env.JWT_SECRET || "top-secret-key";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export const login = async (req: Request, res: Response) => {
  console.log({ req: req.body });

  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.json({ message: "Login successful" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  console.log({ req: req.body });

  try {
    const { firstName, lastName, email, password } = RegisterSchema.parse(
      req.body
    );

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log({ existingUser });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log({ error });
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = async (req: any, res: Response) => {
  console.log({ req: req.user });
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Success",
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out successfully" });
};

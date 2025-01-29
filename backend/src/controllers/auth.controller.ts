import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { CookieOptions } from "express";
import { loginSchema, RegisterSchema } from "../validations";
import { getEnvVar } from "../utils/env";

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "24h";

const config = {
  jwtSecret: getEnvVar("JWT_SECRET", "dev-secret-key"),
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  } as const satisfies CookieOptions,
};

class AuthError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// Helper functions
const createToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, config.jwtSecret, {
    expiresIn: TOKEN_EXPIRY,
  });
};

const sanitizeUser = (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const handleError = (error: unknown, res: Response) => {
  console.error("Auth error:", error);

  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Validation error",
      details: error.errors,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};

// Controller methods
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError("Invalid credentials", 401);
    }

    const token = createToken(user.id, user.email);
    res.cookie("token", token, config.cookieOptions);

    return res.json({
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData = RegisterSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AuthError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const token = createToken(user.id, user.email);
    res.cookie("token", token, config.cookieOptions);

    return res.status(201).json({
      message: "Registration successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getCurrentUser = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authenticated", 401);
    }

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
      throw new AuthError("User not found", 404);
    }

    return res.json({
      message: "Success",
      user,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("token", config.cookieOptions);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return handleError(error, res);
  }
};

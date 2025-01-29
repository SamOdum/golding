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

/**
 * Custom error class for authentication-related errors
 * @class AuthError
 * @extends {Error}
 */
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

/**
 * Creates a JWT token for a user
 * @param {string} userId - The user's ID
 * @param {string} email - The user's email
 * @returns {string} The generated JWT token
 */
const createToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, config.jwtSecret, {
    expiresIn: TOKEN_EXPIRY,
  });
};

/**
 * Removes sensitive information from user object
 * @param {any} user - The user object to sanitize
 * @returns {any} User object without sensitive information
 */
const sanitizeUser = (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Handles errors in authentication routes
 * @param {unknown} error - The error to handle
 * @param {Response} res - Express response object
 * @returns {Response} Error response
 */
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

/**
 * Authenticates a user and creates a session
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Authentication response
 */
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

/**
 * Registers a new user and creates a session
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Registration response
 */
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

/**
 * Gets the current authenticated user's information
 * @param {Request & { user?: any }} req - Express request object with user
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} User information response
 */
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
        email: true,
        firstName: true,
        lastName: true,
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

/**
 * Logs out the current user by clearing their session
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Logout response
 */
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", config.cookieOptions);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return handleError(error, res);
  }
};

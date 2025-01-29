import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWTPayload } from "../types";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;

/**
 * Middleware to authenticate requests using JWT tokens
 *
 * This middleware:
 * 1. Extracts the JWT token from cookies
 * 2. Verifies the token's validity
 * 3. Attaches the decoded user id and email to the request object
 *
 * @param {AuthRequest} req - Express request object with auth extensions
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void | Response>} Continues to next middleware or returns error response
 *
 * @throws {Response} 401 if token is missing or invalid
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

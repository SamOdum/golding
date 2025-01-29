import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWTPayload } from "../types";
import { getEnvVar } from "../utils/env";

const JWT_SECRET = getEnvVar("JWT_SECRET", "dev-secret-key");

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

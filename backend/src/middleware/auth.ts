import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

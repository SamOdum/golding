import { Request } from "express";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none" | undefined;
  maxAge: number;
}

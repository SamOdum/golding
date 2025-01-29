import { Request } from "express";

/**
 * User data structure
 * @interface User
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Payload structure for JWT tokens
 * @interface JWTPayload
 */
export interface JWTPayload {
  /** Unique identifier for the user */
  id: string;
  /** User's email address */
  email: string;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * Extended Express Request interface with authenticated user information
 * @interface AuthRequest
 * @extends {Request}
 */
export interface AuthRequest extends Request {
  /** User information decoded from JWT token */
  user?: JWTPayload;
}

/**
 * Options for setting HTTP cookies
 * @interface CookieOptions
 */
export interface CookieOptions {
  /** Flag to set the cookie as HTTP-only */
  httpOnly: boolean;
  /** Flag to set the cookie as secure */
  secure: boolean;
  /** Same-site attribute for the cookie */
  sameSite: "strict" | "lax" | "none" | undefined;
  /** Maximum age of the cookie in milliseconds */
  maxAge: number;
}

import { z } from "zod";

/**
 * Schema for validating login requests
 * @remarks
 * Requires:
 * - email: Valid email format
 * - password: At least 8 characters
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Schema for validating user registration requests
 * @remarks
 * Requires:
 * - firstName: Non-empty string
 * - lastName: Non-empty string
 * - email: Valid email format
 * - password: At least 8 characters with complexity requirements
 */
export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include uppercase, lowercase, number and special character"
    ),
});

/**
 * Type definitions for login request data
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Type definitions for registration request data
 */
export type RegisterInput = z.infer<typeof RegisterSchema>;

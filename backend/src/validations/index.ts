import { object, string } from "zod";

export const RegisterSchema = object({
  firstName: string(),
  lastName: string(),
  email: string().email(),
  password: string().min(6),
});

export const loginSchema = object({
  email: string().email(),
  password: string().min(6),
});

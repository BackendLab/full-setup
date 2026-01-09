import { z } from "zod";

// Register User Zod Schema
export const registerUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    fullName: z.string().min(2),
    email: z.email(),
    password: z.string().min(8).max(16),
  }),
});

// Login User Zod Schema
export const loginUserSchema = z.object({
  body: z.object({
    identifier: z.union([
      z.email("Invalid email").toLowerCase(),
      z.string().min(3, "Username must be 3 character long"),
    ]),
    password: z
      .string()
      .min(8, "Password must be 8 character long")
      .max(16, "Password must not long than 16 characters"),
  }),
});

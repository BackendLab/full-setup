import { z } from "zod";
import { UserState } from "../constants";

// Update User Zod Schema
export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).optional(),
    fullName: z.string().min(2).optional(),
    bio: z.string().min(10).max(200).optional(),
  }),
});

// Update Avatar Zod Schema
export const updateAvatarSchema = z.object({
  file: z.object({
    path: z.string(),
  }),
});

// update Cover Image Zod Schema
export const updateCoverImageSchema = z.object({
  file: z.object({
    path: z.string(),
  }),
});

// Change Password Zod Schema
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be 8 characters")
      .max(16, "New Password must not be more than 16 characters"),
  }),
});

// User State Schema
export const userStateSchema = z.object({
  state: z.enum(UserState),
});

// watch history validations
// Get Watch history Schema
export const watchHistorySchema = z.object({
  query: z.object({
    page: z.string().default("1").transform(Number),
    limit: z.string().default("12").transform(Number),
  }),
});

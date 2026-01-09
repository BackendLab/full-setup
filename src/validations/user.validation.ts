import { z } from "zod";

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

// Chnage Password Zod Schema
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be 8 characters")
      .max(16, "New Password must noty be more than 16 characters"),
  }),
});

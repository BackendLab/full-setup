import { z } from "zod";
import { ChannelState } from "../constants";

// Zod validation for channel
export const channelParamSchema = z.object({
  params: z.object({
    channelId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ChannelId"),
  }),
});

// Get All the videos of Channel Schema
export const channelVideoSchema = z.object({
  query: z.object({
    page: z.string().default("1").transform(Number),
    limit: z.string().default("12").transform(Number),
  }),
});

// Channel State Schema
export const channelStateSchema = z.object({
  state: z.enum(ChannelState),
});

// Update Channel Info Schema
export const updateChannelInfoSchema = z.object({
  params: z.object({
    channelId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Inavlid ChannelId"),
  }),
  file: z.object({
    path: z.string(),
  }),
});

// Channel Avatar Schema
export const channelAvatarSchema = z.object({
  params: z.object({
    channelId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ChannelId"),
  }),
  file: z.object({
    path: z.string(),
  }),
});

// Channel Cover Image Schema
export const channelCoverImageSchema = z.object({
  params: z.object({
    channelId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ChannelId"),
  }),
  file: z.object({
    path: z.string(),
  }),
});

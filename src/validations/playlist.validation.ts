import { z } from "zod";

// Param Validation Schema
export const playlistParamSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Playlist ID"),
  }),
});

// Query Validation Schema
export const playlistQuerySchema = z.object({
  query: z.object({
    page: z.string().default("1").transform(Number),
    limit: z.string().default("10").transform(Number),
  }),
});

// Create Playlist Validation Schema
export const createPlaylistSchema = z.object({
  body: z.object({
    title: z.string().max(120),
    description: z.string().max(2000).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
  }),
});

// Add Video Validation Schema
export const addVideoSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Playlist ID"),
  }),
  body: z.object({
    videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Video ID"),
  }),
});

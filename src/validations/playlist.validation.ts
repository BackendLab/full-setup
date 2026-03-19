import { z } from "zod";

export const playlistParamSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Playlist ID"),
  }),
});

export const playlistQuerySchema = z.object({
  query: z.object({
    page: z.string().default("1").transform(Number),
    limit: z.string().default("10").transform(Number),
  }),
});

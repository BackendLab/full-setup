import { z } from "zod";

export const videoParamSchema = z.object({
  params: z.object({
    videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Video ID"),
  }),
});

export const UploadVideoSchema = z.object({
  videoFile: z.object({
    url: z.url(),
    publicId: z.string(),
  }),
  duration: z.number(),
});

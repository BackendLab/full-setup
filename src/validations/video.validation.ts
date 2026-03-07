import { z } from "zod";

export const videoParamSchema = z.object({
  params: z.object({
    videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid Video ID"),
  }),
});

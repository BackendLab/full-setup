import { z } from "zod";

// Comments Validation Schema
export const commentsSchema = z.object({
  params: z.object({
    videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Video ID"),
  }),
  query: z.object({
    page: z.string().default("1").transform(Number),
    limit: z.string().default("10").transform(Number),
  }),
});

// Post Comment Validation Schema
export const postCommentSchema = z.object({
  params: z.object({
    videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Video ID"),
  }),
  body: z.object({
    content: z.string().max(1000),
  }),
});

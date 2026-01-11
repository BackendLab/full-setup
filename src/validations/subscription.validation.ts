import { z } from "zod";

// Subscription Zod Schema
export const subscriptionParamSchema = z.object({
  params: z.object({
    channelId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ChannelId"),
  }),
});

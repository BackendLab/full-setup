import { z } from "zod";
import { ChannelState } from "../constants";

// Zod validation for channel
export const channelParamSchema = z.object({
  params: z.object({
    channelId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ChannelId"),
  }),
});

// Channel State Schema
export const channelStateSchema = z.object({
  state: z.enum(ChannelState),
});

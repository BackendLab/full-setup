import mongoose from "mongoose";
import { ChannelState } from "../constants";

interface CloudinaryFiles {
  url?: string;
  publicId?: string;
}

export interface IChannel {
  owner: mongoose.Types.ObjectId;
  name: string;
  handle: string;
  description: string;
  avatar: CloudinaryFiles;
  coverImage: CloudinaryFiles;
  subscriberCount: number;
  state: ChannelState;
}

const channelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxLength: 2000,
      default: "",
    },
    avatar: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    coverImage: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    subscriberCount: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      enum: Object.values(ChannelState),
      default: ChannelState.ACTIVE,
    },
  },
  { timestamps: true }
);

channelSchema.index({ owner: 1 });
channelSchema.index({ state: 1 });

export const Channel = mongoose.model<IChannel>("Channel", channelSchema);

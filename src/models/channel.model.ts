import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export const Channel = mongoose.model<IChannel>("Channel", channelSchema);

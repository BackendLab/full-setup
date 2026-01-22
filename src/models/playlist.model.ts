import mongoose, { Document } from "mongoose";
import { PlaylistState } from "../constants";

export enum PlaylistVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}
export interface IPlaylist extends Document {
  title: string;
  description?: string;
  videos: mongoose.Types.ObjectId[];
  channel: mongoose.Types.ObjectId;
  state: PlaylistState;
  visibility: PlaylistVisibility;
  createdAt: Date;
  updatedAt: Date;
}

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 120,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    visibility: {
      type: String,
      enum: Object.values(PlaylistVisibility),
      default: PlaylistVisibility.PUBLIC,
    },
    state: {
      type: String,
      enum: Object.values(PlaylistState),
      default: PlaylistState.ACTIVE,
    },
  },
  { timestamps: true }
);

// Indexes
playlistSchema.index({ channel: 1, unique: 1 });
playlistSchema.index({ state: 1, unique: 1 });
playlistSchema.index({ visibility: 1, unique: 1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);

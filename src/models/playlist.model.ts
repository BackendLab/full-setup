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
  owner: mongoose.Types.ObjectId;
  status: PlaylistState;
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
      maxLength: 1000,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: Object.values(PlaylistVisibility),
      default: PlaylistVisibility.PUBLIC,
    },
    status: {
      type: String,
      enum: Object.values(PlaylistState),
      default: PlaylistState.ACTIVE,
    },
  },
  { timestamps: true }
);

// Indexes
playlistSchema.index({ owner: 1, visibility: 1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);

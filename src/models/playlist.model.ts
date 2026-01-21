import mongoose, { Document } from "mongoose";
import { PlaylistState } from "../constants";

export interface IPlaylist extends Document {
  title: string;
  description?: string;
  videos: mongoose.Types.ObjectId[];
  channel: mongoose.Types.ObjectId;
  state: PlaylistState;
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
    state: {
      type: String,
      enum: Object.values(PlaylistState),
      default: PlaylistState.PUBLIC,
    },
  },
  { timestamps: true }
);

// Indexes
playlistSchema.index({ channel: 1, unique: 1 });
playlistSchema.index({ state: 1, unique: 1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);

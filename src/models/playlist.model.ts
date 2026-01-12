import mongoose, { Document } from "mongoose";

export interface IPlaylist extends Document {
  title: string;
  description?: string;
  videos: mongoose.Types.ObjectId[];
  channel: mongoose.Types.ObjectId;
  isPublic: boolean;
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
    isPublished: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);

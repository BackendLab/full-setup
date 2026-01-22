import mongoose, { Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { VideoState } from "../constants";

export enum VideoVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

// interface must extends Document only when we need mongoose inbuild methods otherwise, No need of that
export interface IVideo extends Document {
  videofile: string;
  title: string;
  description: string;
  thumbnail: string; // cloudinary url
  duration: number;
  category: string;
  tags: string[];
  views: number;
  likesCount: number;
  commentsCount: number;
  channel: mongoose.Types.ObjectId;
  playlist?: mongoose.Types.ObjectId;
  visibility: VideoVisibility;
  state: VideoState;
}

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 5,
      max: 150,
    },
    description: {
      type: String,
      required: true,
      min: 5,
      max: 1000,
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    view: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
    visibility: {
      type: String,
      enum: Object.values(VideoVisibility),
      default: VideoVisibility.PUBLIC,
    },
    state: {
      type: String,
      enum: Object.values(VideoState),
      default: VideoState.ACTIVE,
    },
  },
  { timestamps: true }
);

// Indexes
videoSchema.index({ channel: 1, unique: 1 });
videoSchema.index({ playlist: 1, unique: 1 });
videoSchema.index({ visibility: 1, unique: 1 });
videoSchema.index({ state: 1, unique: 1 });

// Added a plugin of mongoose aggregate paginate version 2 for pagination
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model<IVideo>("Video", videoSchema);

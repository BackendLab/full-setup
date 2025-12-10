import mongoose from "mongoose";

export interface IVideo {
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
  owner: mongoose.Schema.Types.ObjectId;
  isPublished: boolean;
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model<IVideo>("Video", videoSchema);

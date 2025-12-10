import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// interface must extends Document only when we need mongoose inbuild methods otherwise, No need of that
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

// Added a plugin of mongoose aggregate paginate version 2 for pagination
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model<IVideo>("Video", videoSchema);

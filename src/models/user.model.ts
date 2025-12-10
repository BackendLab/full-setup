import mongoose from "mongoose";

export interface IUser {
  username: string;
  fullName: string;
  email: string;
  password: string;
  watchHistory: mongoose.Schema.Types.ObjectId;
  subscribers: number;
  channelSubscribed: mongoose.Schema.Types.ObjectId;
  refreshToken: mongoose.Schema.Types.ObjectId;
  avatar: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      // must stored hasehed password
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    subscribers: {
      type: Number,
      required: true,
    },
    channelSubscribed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      // Cloudinary Image String
      type: String,
    },
    coverImage: {
      // Cloudinary Image String
      type: String,
    },
    refreshToken: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RefreshToken",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

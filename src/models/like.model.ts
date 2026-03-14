import mongoose, { Document } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
likeSchema.index({ user: 1, video: 1 }, { unique: true }); // No duplicate likes

export const Like = mongoose.model("Like", likeSchema);

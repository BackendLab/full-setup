import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Indexes
commentSchema.index({ video: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);

import mongoose, { Document } from "mongoose";

export interface IView extends Document {
  viewerKey: string;
  video: mongoose.Types.ObjectId;
  lastCountedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const viewSchema = new mongoose.Schema(
  {
    viewerKey: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    lastCountedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes
viewSchema.index({ viewerKey: 1, video: 1 }, { unique: true });

export const View = mongoose.model<IView>("View", viewSchema);

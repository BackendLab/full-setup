import mongoose, { Document, Types } from "mongoose";

export interface IWatchHistory extends Document {
  user: Types.ObjectId;
  video: Types.ObjectId;
  watchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true }); // No duplicate videos in watch history
watchHistorySchema.index({ user: 1, watchedAt: -1 }); // Fast watch history retrival

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

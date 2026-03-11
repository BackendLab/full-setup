import mongoose from "mongoose";

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

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import {
  addVideo,
  createPlaylist,
  deleteVideo,
  getSinglePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  addVideoSchema,
  createPlaylistSchema,
  deleteVideoSchema,
  playlistParamSchema,
  playlistQuerySchema,
  updatePlaylistSchema,
} from "../validations/playlist.validation";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

// Get Single Playlist
router.get(
  "/:playlistId",
  optionalAuth,
  validate(playlistParamSchema),
  validate(playlistQuerySchema),
  getSinglePlaylist
);

// Create Single Playlist
router.post("/", verifyJwt, validate(createPlaylistSchema), createPlaylist);

// Add Video in Playlist
router.post(
  "/:playlistId/video",
  verifyJwt,
  validate(addVideoSchema),
  addVideo
);

// Delete Video from Playlist
router.delete(
  "/:playlistId/videos/:videoId",
  verifyJwt,
  validate(deleteVideoSchema),
  deleteVideo
);

// Update Playlist
router.patch(
  "/:playlistId",
  verifyJwt,
  validate(updatePlaylistSchema),
  updatePlaylist
);

// Delete Playlist
router.delete("/:playlistId", verifyJwt);

export default router;

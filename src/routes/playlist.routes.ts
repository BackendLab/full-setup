import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import {
  addVideo,
  createPlaylist,
  getSinglePlaylist,
} from "../controllers/playlist.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  addVideoSchema,
  createPlaylistSchema,
  playlistParamSchema,
  playlistQuerySchema,
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

export default router;

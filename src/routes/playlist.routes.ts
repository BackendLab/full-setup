import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import {
  createPlaylist,
  getSinglePlaylist,
} from "../controllers/playlist.controller";
import { validate } from "../middlewares/validation.middleware";
import {
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

export default router;

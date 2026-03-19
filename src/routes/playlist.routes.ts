import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { getSinglePlaylist } from "../controllers/playlist.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  playlistParamSchema,
  playlistQuerySchema,
} from "../validations/playlist.validation";

const router = Router();

// Get Single Playlist
router.get(
  "/:playlistId",
  optionalAuth,
  validate(playlistParamSchema),
  validate(playlistQuerySchema),
  getSinglePlaylist
);

export default router;

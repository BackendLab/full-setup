import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { getSinglePlaylist } from "../controllers/playlist.controller";

const router = Router();

// Get Single Playlist
router.get("/:playlistId", optionalAuth, getSinglePlaylist);

export default router;

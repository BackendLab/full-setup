import { Router } from "express";

import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import {
  addView,
  getSingleVideo,
  getUploadSignature,
  updateMetadata,
  uploadVideo,
} from "../controllers/video.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  updateMetadataSchema,
  videoParamSchema,
} from "../validations/video.validation";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

// Get Single Video
router.get(
  "/:videoId",
  optionalAuth,
  validate(videoParamSchema),
  getSingleVideo
);

// --- Uploading Video ---
// For directly upload video from frontend I need 3 apis - 1st - signature assigning, 2nd - uploading video / creating video record in DB, 3rd - updating video metadata

// Assigning browser a signaturee for authorization
router.get("/upload-signature", verifyJwt, getUploadSignature);
// Uploading video / Creating video record in DB
router.post("/", verifyJwt, uploadVideo);
// Updating Video Metadata
router.patch(
  "/:videoId",
  verifyJwt,
  validate(updateMetadataSchema),
  updateMetadata
);

// Engagement Routes of video
// view route
router.post(
  "/:videoId/view",
  optionalAuth,
  validate(videoParamSchema),
  addView
);
export default router;

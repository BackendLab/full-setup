import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  getChannelInfo,
  getFeaturedContent,
  getPlaylists,
  getVideos,
  updateAvatar,
  updateChannelInfo,
  updateCoverImage,
} from "../controllers/channel.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  channelAvatarSchema,
  channelCoverImageSchema,
  channelParamSchema,
  channelVideoSchema,
  updateChannelInfoSchema,
} from "../validations/channel.validation";
import { checkChannelState } from "../middlewares/channelState.middleware";

const router = Router();

// Channel Routes
// This endpoint is for getting the info of a specific channel
router.get(
  "/:channelId",
  verifyJwt,
  checkChannelState,
  validate(channelParamSchema),
  getChannelInfo
);

router.get(
  "/:channelId/featured",
  verifyJwt,
  checkChannelState,
  validate(channelParamSchema),
  getFeaturedContent
);

router.get(
  "/:channelId/videos",
  verifyJwt,
  checkChannelState,
  validate(channelParamSchema),
  validate(channelVideoSchema),
  getVideos
);

router.get(
  "/:channelId/playlists",
  verifyJwt,
  checkChannelState,
  validate(channelParamSchema),
  getPlaylists
);

// This endpont is for updating the channel info
router.patch(
  "/:channelId",
  verifyJwt,
  checkChannelState,
  validate(updateChannelInfoSchema),
  updateChannelInfo
);

router.patch(
  "/:channelId/avatar",
  verifyJwt,
  validate(channelAvatarSchema),
  checkChannelState,
  updateAvatar
);

router.patch(
  "/:channelId/cover-image",
  verifyJwt,
  checkChannelState,
  validate(channelCoverImageSchema),
  updateCoverImage
);

export default router;

import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  getChannelProfile,
  updateAvatar,
  updateChannelInfo,
  updateCoverImage,
} from "../controllers/channel.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  channelAvatarSchema,
  channelCoverImageSchema,
  channelParamSchema,
  updateChannelInfoSchema,
} from "../validations/channel.validation";
import { checkChannelState } from "../middlewares/channelState.middleware";

const router = Router();

// Channel Routes
// This endpoint is for getting the info of a specific channel
router.get(
  "/channel/:channelId",
  verifyJwt,
  checkChannelState,
  validate(channelParamSchema),
  getChannelProfile
);

// This endpont is for updating the channel info
router.patch(
  "/channel/:channelId",
  verifyJwt,
  validate(updateChannelInfoSchema),
  updateChannelInfo
);

router.patch(
  "/channel/:channelId/avatar",
  verifyJwt,
  validate(channelAvatarSchema),
  checkChannelState,
  updateAvatar
);

router.patch(
  "/channel/:channelId/cover-image",
  verifyJwt,
  validate(channelCoverImageSchema),
  updateCoverImage
);

export default router;

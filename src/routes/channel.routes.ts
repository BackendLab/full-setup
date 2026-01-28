import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  getChannelProfile,
  updateAvatar,
  updateChannelInfo,
} from "../controllers/channel.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  channelAvatarSchema,
  channelParamSchema,
} from "../validations/channel.validation";
import { checkChannelState } from "../middlewares/channelState.middleware";

const router = Router();

// Channel Routes
// This en;dpoint is for getting the info of a specific channel
router.get(
  "/channel/:channelId",
  verifyJwt,
  checkChannelState,
  validate(channelParamSchema),
  getChannelProfile
);

router.patch(
  "/channel/:channelId/avatar",
  verifyJwt,
  validate(channelAvatarSchema),
  checkChannelState,
  updateAvatar
);

// This endpont is for updating the channel info
router.patch("/channel/:channelId", verifyJwt, updateChannelInfo);
export default router;

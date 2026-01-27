import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  getChannelProfile,
  updateAvatar,
} from "../controllers/channel.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  channelAvatarSchema,
  channelParamSchema,
} from "../validations/channel.validation";
import { checkChannelState } from "../middlewares/channelState.middleware";

const router = Router();

// Channel Routes
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

export default router;

import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { getChannelProfile } from "../controllers/channel.controller";

const router = Router();

// Channel Routes
router.get("/channel/:channelId", verifyJwt, getChannelProfile);

export default router;

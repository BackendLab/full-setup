import { Router } from "express";

import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { getSingleVideo } from "../controllers/video.controller";

const router = Router();

router.get("/:videoId", optionalAuth, getSingleVideo);

export default router;

import { Router } from "express";

import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { getSingleVideo } from "../controllers/video.controller";
import { validate } from "../middlewares/validation.middleware";
import { videoParamSchema } from "../validations/video.validation";

const router = Router();

router.get(
  "/:videoId",
  optionalAuth,
  validate(videoParamSchema),
  getSingleVideo
);

export default router;

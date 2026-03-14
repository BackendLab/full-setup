import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  changePassword,
  deleteUser,
  deleteWatchHistoryVideo,
  getCurrentUser,
  getWatchHistory,
  updateUser,
  updateWatchHistory,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  changePasswordSchema,
  updateCoverImageSchema,
  updateUserSchema,
  watchHistorySchema,
} from "../validations/user.validation";
import { videoParamSchema } from "../validations/video.validation";

const router = Router();

// Secured Route
router.get("/me", verifyJwt, getCurrentUser);
router.patch("/profile", verifyJwt, validate(updateUserSchema), updateUser);

router.patch(
  "/change-password",
  verifyJwt,
  validate(changePasswordSchema),
  changePassword
);
router.delete("/me", verifyJwt, deleteUser);

// Watch History Routes
router.get(
  "/me/watch-history",
  verifyJwt,
  validate(watchHistorySchema),
  getWatchHistory
);
// Update watch history
router.patch(
  "/me/watch-history/:videoId",
  verifyJwt,
  validate(videoParamSchema),
  updateWatchHistory
);

// Delete videos from watch history
router.delete(
  "/me/watch-history/:videoId",
  verifyJwt,
  validate(videoParamSchema),
  deleteWatchHistoryVideo
);

export default router;

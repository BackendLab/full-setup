import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  changePassword,
  deleteUser,
  getCurrentUser,
  getWatchHistory,
  // updateAvatar,
  updateCoverImage,
  updateUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  changePasswordSchema,
  updateAvatarSchema,
  updateCoverImageSchema,
  updateUserSchema,
  watchHistorySchema,
} from "../validations/user.validation";

const router = Router();

// Secured Route
router.get("/me", verifyJwt, getCurrentUser);
router.patch("/profile", verifyJwt, validate(updateUserSchema), updateUser);
// router.patch(
//   "/avatar",
//   verifyJwt,
//   upload.single("avatar"),
//   validate(updateAvatarSchema),
//   updateAvatar
// );
router.patch(
  "/cover-image",
  verifyJwt,
  upload.single("coverImage"),
  validate(updateCoverImageSchema),
  updateCoverImage
);
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

export default router;

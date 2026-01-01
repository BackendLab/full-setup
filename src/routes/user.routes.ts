import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  changePassword,
  deleteUser,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  updateUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// Secured Route
router.get("/me", verifyJwt, getCurrentUser);
router.patch("/profile", verifyJwt, updateUser);
router.patch("/avatar", verifyJwt, upload.single("avatar"), updateAvatar);
router.patch(
  "/cover-image",
  verifyJwt,
  upload.single("coverImage"),
  updateCoverImage
);
router.patch("/change-password", verifyJwt, changePassword);
router.delete("/me", verifyJwt, deleteUser);

export default router;

import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  getCurrentUser,
  updateAvatar,
  updateUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// Secured Route
router.get("/me", verifyJwt, getCurrentUser);
router.patch("/profile", verifyJwt, updateUser);
router.patch("/avatar", verifyJwt, upload.single("avatar"), updateAvatar);

export default router;

import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { getCurrentUser, updateUser } from "../controllers/user.controller";

const router = Router();

// Secured Route
router.get("/me", verifyJwt, getCurrentUser);
router.patch("/profile", verifyJwt, updateUser);

export default router;

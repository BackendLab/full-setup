import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { getCurrentUser } from "../controllers/user.controller";

const router = Router();

// Secured Route
router.get("/me", verifyJwt, getCurrentUser);

export default router;

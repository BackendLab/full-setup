import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

// Method 1 - directly calls the post method and its simple to read and write
router.post("/register", registerUser);
router.post("/login", loginUser);

// Secured Routes
router.post("/logout", verifyJwt, logoutUser);

// Method 2 - it make the route seprately and used when multiple HTTP methods exists on same route like GET, POST, DELETE
// router.route("/register").post(registerUser);

export default router;

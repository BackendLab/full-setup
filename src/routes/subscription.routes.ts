import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { subscriptionParamSchema } from "../validations/subscription.validation";
import { subscribe, unsubscribe } from "../controllers/subscription.controller";

const router = Router();

// Subscribe Route
router.post(
  "/:channelId",
  verifyJwt,
  validate(subscriptionParamSchema),
  subscribe
);

// Unsubscribe Route
router.delete(
  "/:channelId",
  verifyJwt,
  validate(subscriptionParamSchema),
  unsubscribe
);

export default router;

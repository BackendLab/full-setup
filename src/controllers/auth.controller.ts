import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({
    message: "ok",
  });
});

export default registerUser;

import { getCurrentUserService } from "../services/user.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    // check before fetching Id from req.user cause typescript shout about the type of userId
    if (!req.user) {
      throw new ApiError(401, "Unauthorized user");
    }
    // get tyhe user from req user
    const userId = req.user?._id;
    // Call the service to get the user
    const user = await getCurrentUserService(userId.toString());
    // return the response
    res
      .status(201)
      .json(new ApiResponse(201, "User Feteched Successfully", user));
  }
);

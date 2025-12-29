import {
  getCurrentUserService,
  updateUserService,
} from "../services/user.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

// Get Current User
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

// Update User Profile
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // check if the user exist or not in req.user
  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }
  // Get the user from req.user
  const userId = req.user?._id;
  // Get all the data from user
  const { fullName, username, bio } = req.body;
  // Cherck if all the feilds are avaiable or not
  if (!fullName || !username || !bio) {
    throw new ApiError(400, "all feilds are required");
  }
  // Call the service with user ID + all the feilds
  const updatedUser = await updateUserService(userId?.toString(), {
    fullName,
    username,
    bio,
  });
  // Send response back to the client
  res
    .status(200)
    .json(
      new ApiResponse(200, "User profile updated successfully!", updatedUser)
    );
});

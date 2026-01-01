import {
  getCurrentUserService,
  updateUserService,
  updateAvatarService,
  updateCoverImageService,
  changePasswordService,
  deleteUserService,
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

// Update Avatar
export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    // get the user Id from req.user
    const userId = req.user?._id;

    // check if the user exist or not in req.user
    if (!userId) {
      throw new ApiError(401, "User not authorized");
    }

    // get the file from user from req.file
    const filePath = req.file?.path;

    //check if file exists or not inside req.file
    if (!filePath) {
      throw new ApiError(400, "file does not exist");
    }
    // call the service
    const uploadedAvatar = await updateAvatarService(
      userId.toString(),
      filePath
    );
    // give the response back to the client
    res
      .status(200)
      .json(
        new ApiResponse(200, "Avatar updated successfully!", uploadedAvatar)
      );
  }
);

// Update Cover Image
export const updateCoverImage = asyncHandler(
  async (req: Request, res: Response) => {
    // get the user form req.user
    const userId = req.user?._id;
    // check if user exists or not
    if (!userId) {
      throw new ApiError(401, "User not authorized");
    }
    // get this file from req.file
    const filePath = req.file?.path;
    // ckeck if the file path exists or not
    if (!filePath) {
      throw new ApiError(400, "file does not found");
    }
    // call the service
    const uploadedCoverImage = await updateCoverImageService(
      userId.toString(),
      filePath
    );
    // give response back to the client
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Cover Image updated successfully!",
          uploadedCoverImage
        )
      );
  }
);

// Change Password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    // get userId from req.user
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "User not authorized");
    }
    // get old and new password from the user in req.body
    const { oldPassword, newPassword } = req.body;

    // validate both inputs exists or not
    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "All Fields are required!");
    }

    // call the service
    await changePasswordService(userId.toString(), {
      oldPassword,
      newPassword,
    });
    // give back the response to the client
    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      // cleared Refresh Token
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json(
        new ApiResponse(
          200,
          "Password Chnaged Successfully!, Please log-in again",
          null
        )
      );
  }
);

// Delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // get the userId from req.suer
  const userId = req.user?._id;
  // check if user Id exists or not
  if (!userId) {
    throw new ApiError(401, "User is not authorized!");
  }
  // call service
  await deleteUserService(userId.toString());
  // give response back to the client
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Deleted Successfully!", null));
});

import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import { User } from "../models/user.model";
import { WatchHistory } from "../models/watchHistory.model";
import { ApiError } from "../utils/apiError";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

// Interface for Updating User
interface updateUserPayload {
  fullName: string;
  username: string;
  bio: string;
}

// Interface for Changing Password
interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

// Get Current User Service
export const getCurrentUserService = async (userId: string) => {
  try {
    // get the user from db and sanitize it
    const user = await User.findById(userId).select("-password -refreshToken");
    // check if user exists or not
    if (!user) {
      throw new ApiError(401, "User does not exist");
    }
    // return the user
    return user;
  } catch (error) {
    throw error;
  }
};

// Update the user profile Service
export const updateUserService = async (
  userId: string,
  { fullName, username, bio }: updateUserPayload // Accept user ID and all the fields
) => {
  try {
    // Check the uniqueness of username
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      // if the user exist with same username then throw error
      if (existingUser) {
        throw new ApiError(409, "Username already taken");
      }
    }

    // Find & Update user in DB with sanitization
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        username,
        bio,
      },
      { new: true, runValidators: true, omitUndefined: true } // NOTE: "omitUndefined is a method of mongoose which remove all the fields stritly have the value of undefined"
    ).select("-password -refreshToken");

    // Return the sanitized user
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// Upload avatar Service
// export const updateAvatarService = async (userId: string, filePath: string) => {
//   try {
//     // get the user form userId
//     const user = await User.findById(userId);
//     // check if user exists or not
//     if (!user) {
//       throw new ApiError(401, "User does not exist");
//     }
//     // upload the file
//     const uploadedAvatar = await uploadToCloudinary(filePath);

//     // check if file uploaded or not
//     if (!uploadedAvatar || !uploadedAvatar.url || !uploadedAvatar.public_id) {
//       throw new ApiError(500, "Avatar upload failed");
//     }

//     // check if there a file exists if yes then delete the previous file using public id
//     if (user.avatar?.publicId) {
//       await deleteFromCloudinary(user.avatar.publicId);
//     }

//     // update & save the user in DB
//     user.avatar = {
//       url: uploadedAvatar?.url,
//       publicId: uploadedAvatar?.public_id,
//     };
//     await user.save({ validateBeforeSave: false });

//     // return the upodatedAvatar method
//     return { url: uploadedAvatar?.url, publicId: uploadedAvatar?.public_id };
//   } catch (error) {
//     console.error("Update avatar service failed");
//     throw error;
//   }
// };

// Update Cover Image Service
export const updateCoverImageService = async (
  userId: string,
  filePath: string
  // get the userID and filepath from controller
) => {
  // get the user through userId
  const user = await User.findById(userId);
  // check if user exists or not
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  // upload the image
  const uploadedCoverImage = await uploadToCloudinary(filePath);

  // check if there is previous cover image exists, If yes then delete it
  if (user.coverImage?.publicId) {
    await deleteFromCloudinary(user.coverImage.publicId);
  }
  // once new cover image uploaded and previous one is deleted then update & save the user in DB
  user.coverImage = {
    url: uploadedCoverImage?.url,
    publicId: uploadedCoverImage?.public_id,
  };
  await user.save({ validateBeforeSave: false });

  // Sanitize the user without quering to DB
  // How to do it without query DB ->
  // save the user as a object inside a variable
  // destructure the user object and extract password & refresh token then save the remaining fields in safeuser.
  // NOTE: The ... is rest operator, simple way to remeber this if ... is used in left side of operand then it's rest operator, if it's in right side then spread operator
  const userObject = user.toObject();
  const { password, refreshToken, ...safeUser } = userObject;

  // return the update coverimage
  return { user: safeUser };
};

// Change password Service
export const changePasswordService = async (
  // Accept the userID and payload from controller as param
  userId: string,
  { oldPassword, newPassword }: ChangePassword
) => {
  // Get the user from DB
  const user = await User.findById(userId);
  // Check if user exists or not
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }
  // compare current password with the stored one
  const isMatch = await user.comparePassword(oldPassword);
  // check if the old password is same as stored in db or not
  if (!isMatch) {
    throw new ApiError(400, "Old password is incoorect!");
  }
  // prevent same password issue old and new must not the same
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different!");
  }
  // update password
  user.password = newPassword;

  // inavlidate sessions
  user.refreshToken = undefined;
  // save the user
  await user.save();
  // nothing to return
};

// Delete User Service
export const deleteUserService = async (userId: string) => {
  // get the user from DB
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }
  // delete all cloudinary files
  if (user?.avatar?.publicId) {
    await deleteFromCloudinary(user?.avatar?.publicId);
  }
  if (user?.coverImage?.publicId) {
    await deleteFromCloudinary(user?.coverImage?.publicId);
  }
  // delete the user
  await User.findByIdAndDelete(userId);
};

// Watch History Service
// get watch history
export const getWatchHistoryService = async (
  // get the userId and query params
  userId: string,
  page: number,
  limit: number
) => {
  // calculating offset pagination
  const skip = (page - 1) * limit;

  // filter to find the watch history
  const filter = {
    user: userId,
    status: "ACTIVE",
  };

  // get all the watch history
  const [watchHistory, totalVideos] = await Promise.all([
    WatchHistory.find(filter)
      .sort({ watchedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("video"),

    WatchHistory.countDocuments(filter),
  ]);

  // calculate totla pages
  const totalPages = Math.ceil(totalVideos / limit);

  // return the response
  return {
    watchHistory,
    pagination: {
      page,
      limit,
      totalVideos,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
    },
  };
};

// Update Watch History
export const updateWatchHistoryService = async (
  // get the user & video id's
  userId: string,
  videoId: string
) => {
  // update history
  const updateHistory = await WatchHistory.findOneAndUpdate(
    {
      user: userId,
      video: videoId,
    },
    { watchedAt: -1 },
    { upsert: true, new: true }
  );
  // return the updated history
  return updateHistory;
};

// Delete the video from watch history
export const deleteWatchHistoryVideoService = async (
  // get the user & video Id
  userId: string,
  videoId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  // delete the video from DB
  const deleteVideo = await WatchHistory.findOneAndDelete({
    user: userId,
    video: videoId,
  });

  // check if the delete video not exist then throw error
  if (!deleteVideo) {
    throw new ApiError(404, "Watch History not found");
  }
  // return the response
  return deleteVideo;
};

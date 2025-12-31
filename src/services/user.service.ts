import cloudinary from "../config/cloudinary";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

// Interface for Updating User
interface updateUserPayload {
  fullName: string;
  username: string;
  bio: string;
}

// Get Current User business logic
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

// Update the user profile business logic
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

// Upload avatar
export const updateAvatarService = async (userId: string, filePath: string) => {
  try {
    // get the user form userId
    const user = await User.findById(userId);
    // check if user exists or not
    if (!user) {
      throw new ApiError(401, "User does not exist");
    }
    // upload the file
    const uploadedAvatar = await uploadToCloudinary(filePath);

    // check if file uploaded or not
    if (!uploadedAvatar || !uploadedAvatar.url || !uploadedAvatar.public_id) {
      throw new ApiError(500, "Avatar upload failed");
    }

    // check if there a file exists if yes then delete the previous file using public id
    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    // update & save the user in DB
    user.avatar = {
      url: uploadedAvatar?.url,
      publicId: uploadedAvatar?.public_id,
    };
    await user.save({ validateBeforeSave: false });

    // return the upodatedAvatar method
    return { url: uploadedAvatar?.url, publicId: uploadedAvatar?.public_id };
  } catch (error) {
    console.error("Update avatar service failed");
    throw error;
  }
};

// Update Cover Image
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

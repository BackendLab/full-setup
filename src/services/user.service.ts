import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

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

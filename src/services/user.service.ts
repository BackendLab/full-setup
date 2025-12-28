import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

export const getCurrentUserService = async (userId: string) => {
  // get the user from db and sanitize it
  const user = await User.findById(userId).select("-password -refreshToken");
  // check if user exists or not
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }
  // return the user
  return user;
};

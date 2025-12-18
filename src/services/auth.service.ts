import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

interface RegisterUserPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export const registerUserService = async ({
  username,
  fullName,
  email,
  password,
}: RegisterUserPayload) => {
  // check if the user exists or not
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // if the user does not exists then create a new one
  const user = await User.create({
    username,
    fullName,
    email,
    password,
    subscribers: 0,
  });

  // Return the user with out password and tokens
  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return safeUser;
};

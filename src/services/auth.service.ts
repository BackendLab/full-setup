import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

// Register User Types
interface RegisterUserPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

// Login User Types
interface LoginUserPayload {
  identifier: string;
  password: string;
}

// Register User service
// -------------------------
export const registerUserService = async ({
  username,
  fullName,
  email,
  password,
}: RegisterUserPayload) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

// Login User service
// -------------------------
export const loginUserService = async ({
  identifier,
  password,
}: LoginUserPayload) => {
  try {
    // first check if the user gave email or username
    const isEmail = identifier.includes("@");

    // check if the user exists or not
    const existingUser = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );

    if (!existingUser) {
      throw new ApiError(409, "User does not exist");
    }
    // if the existing user exist then check if the password is valid or not
    const isPasswordValid = await existingUser.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(404, "User credentials are invalid");
    }
    // generate access Token & refresh Token
    // NOTE: Token generation are always syncronous
    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    // update the refresh Token feild with newly generated one
    existingUser.refreshToken = refreshToken;
    await existingUser.save({ validateBeforeSave: false });

    // remove password and refresh token feilds for security
    const safeUser = await User.findById(existingUser._id).select(
      "-password -refreshToken"
    );

    return { user: safeUser, accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const logoutUserService = async (userId: string) => {
  try {
    // Get user by id
    const user = await User.findById(userId);
    // check if user exists or not
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // remove refresh token from user
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    return true;
  } catch (error) {
    throw error;
  }
};
// 3. Add business logout inside service (Auth service) - it's only a business logic where we query data from DB
// - get user id from controller as param
// - then find the user and update refresh token to undefined
// - return true

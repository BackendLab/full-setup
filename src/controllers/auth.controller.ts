// NOTE: inside controller only HTTP request logic comes no business logic, no routing, no databse
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

// Register User controller
// ------------------------------
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // get the data from req.body
    const { username, fullName, email, password } = req.body;

    // check if all the fields are available or not
    if (!username || !fullName || !email || !password) {
      throw new ApiError(400, "All feilds are required!");
    }

    // Call the service
    const user = await registerUserService({
      username,
      fullName,
      email,
      password,
    });

    // Controller sends the response
    res
      .status(201)
      .json(new ApiResponse(201, "User Resitered Successfully", user));
  }
);

// Login User controller
// ------------------------------
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // get data from user in req.body
  const { identifier, password } = req.body;

  // check if all the feilds are available or not
  if (!identifier || !password) {
    throw new ApiError(404, "All feilds are required");
  }
  // Call the login service
  // what this does the controller sends the payload to serrvice then service do some checks and query to databaswe then gets the data and then give that back to controller. So the controller sends the repsonse of the request user asked
  const { user, accessToken, refreshToken } = await loginUserService({
    identifier,
    password,
  });
  // give the response including cookies
  res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: Number(Bun.env.ACCESS_TOKEN_MAX_AGE),
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: Number(Bun.env.REFRESH_TOKEN_MAX_AGE),
    })
    .json(new ApiResponse(200, "Login successful", user));
});

// Logout User
// 1. Verify is user loged in or not (Middleware)
// -- how to verify that - first get the access token from cookies
// - Then check if the token is valid or not
// - Once get the token than verify if that token is same as saved in db
// - Now find the user through id and remove password
// - check if user exists or not
// - save user inside request
// - call next()

// 2. Add logoutUser method to controller (Controller) - it's a HTTP request logic only
// - get the user through req cause user is now called from req
// - call the service with user id
// remove the cokkies

// 3. Add business logout inside service (Auth service) - it's only a business logic where we query data from DB
// - get user id from controller as param
// - then find the user and update refresh token to undefined
// - return true

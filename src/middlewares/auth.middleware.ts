import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from cookies
    const token = req.cookies?.accessToken;
    // Check if token exists or not
    if (!token) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    // verify if the token is same as in db
    const verifyTokenfromUser = jwt.verify(
      token,
      Bun.env.ACCESS_TOKEN_SECRET!
    ) as { _id: string };

    // Find the user through Id and remove password
    const user = await User.findById(verifyTokenfromUser._id).select(
      "-password"
    );

    // check if user exists or not
    if (!user) {
      throw new ApiError(409, "User does not exists!");
    }
    // NOTE: At this point everyhting works fine, but when we assign user to req.user then typescript will scream that it doesn't know what user is, So typesript sees it like
    // interface Request {
    // body: any;
    // params: any;
    // query: any;
    // ❌ no user
    // }
    // So what should we do - Extend Express's Request type globally
    // And this method of adding types is "MODULE AUGMENTATION"
    req.user = user;
    next();
  }
);

// Logout User
// 1. Verify is user loged in or not (Middleware)
// -- how to verify that - first get the access token from cookies
// - Then check if the token is valid or not
// - Once get the token than verify if that token is same as saved in db
// - Now find the user through id and remove password
// - check if user exists or not
// - save user inside request
// - call next()

import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const OptionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get token from cokkies
    const token = req.cookies?.accessToken;
    // pass next even if the token doesn't exist
    if (!token) {
      return next();
    }
    // if the token exists then verify if the token is same as in DB
    const verifyTokenfromUser = jwt.verify(
      token,
      Bun.env.ACCESS_TOKEN_SECRET!
    ) as { _id: string };
    // find the user and remove the sensitive data
    const user = await User.findById(verifyTokenfromUser._id).select(
      "-password"
    );
    // if user exists then attach user with req
    if (user) {
      req.user = user;
    }
    next();
  }
);

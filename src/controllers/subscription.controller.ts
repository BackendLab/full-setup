import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import {
  subscribeService,
  unsubscribeService,
} from "../services/subscription.service";
import { ApiResponse } from "../utils/apiResponse";

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  // get the subscriber Id from req.user
  const subscriberId = req.user?._id;
  // check if the user exist or not
  if (!subscriberId) {
    throw new ApiError(401, "Unauthorized request");
  }
  // get the cahnnel Id from url
  const channelId = req.params.channelId;
  //   check if the channel exist or not
  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }
  // call the service
  await subscribeService(subscriberId.toString(), channelId);
  // give the response back to the client
  res.status(200).json(new ApiResponse(200, "Subscribed Successfully", null));
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  // get the id's
  const subscriberId = req.user?._id;
  // check if user exits or not
  if (!subscriberId) {
    throw new ApiError(401, "unauthorized request");
  }

  const channelId = req.params.channelId;
  // check if the channel exists or not
  if (!channelId) {
    throw new ApiError(400, "Channel Id is required");
  }
  //   call service
  await unsubscribeService(subscriberId.toString(), channelId);

  // return the response back to the client
  res.status(200).json(new ApiResponse(200, "Unsubscribed successfully", null));
});

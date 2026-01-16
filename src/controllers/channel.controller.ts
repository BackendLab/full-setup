import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { getChannelProfileService } from "../services/channel.service";
import { ApiResponse } from "../utils/apiResponse";

export const getChannelProfile = asyncHandler(
  async (req: Request, res: Response) => {
    // get the channel id and viewer id from request
    const viewerId = req.user?._id;
    // check if  viewer  exist or not
    if (!viewerId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const { channelId } = req.params;
    // check if channelId exists or not
    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }
    // call the service
    const channelData = await getChannelProfileService(
      viewerId.toString(),
      channelId
    );
    // give back the response to the client
    res
      .status(200)
      .json(new ApiResponse(200, "Channel fetched successfully", channelData));
  }
);

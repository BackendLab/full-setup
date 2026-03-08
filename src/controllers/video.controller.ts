import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import {
  getSingleVideoService,
  getUploadSignatureService,
  uploadVideoService,
} from "../services/video.service";
import { ApiResponse } from "../utils/apiResponse";
import { Channel } from "../models/channel.model";

// Get Single Video
export const getSingleVideo = asyncHandler(
  async (req: Request, res: Response) => {
    // get the video and viewer id
    const { videoId } = req.params;
    // check if the video id exists or not
    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }
    const viewerId = req.user?._id;
    // call the service
    const singleVideo = await getSingleVideoService(
      videoId,
      viewerId?.toString()
    );
    // give back the response to the client
    res
      .status(200)
      .json(
        new ApiResponse(200, "Single Video fetched Successfully!", singleVideo)
      );
  }
);

// Uploading Video
// Get Upload Signature
export const getUploadSignature = asyncHandler(
  async (req: Request, res: Response) => {
    // In this request client won't send anything just call for getting the signature, so no requset
    // call the service
    const uploadSignature = await getUploadSignatureService();
    // give back the response to the client
    res
      .status(200)
      .json(
        new ApiResponse(200, "Signature fetched successfully", uploadSignature)
      );
  }
);

// Upload Video / Creating video Record In DB
export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  // gte the user id
  const userId = req.user?._id;
  // find the channel using userId and extract the channel Id
  const channel = await Channel.findOne({
    owner: userId,
  }).select("_id");
  // ckeck if the channel exists or not
  if (!channel) {
    throw new ApiError(404, "Channel Not Found");
  }
  // get the videoFile from the user
  const { videoFile, duration } = req.body;
  // check if the videoFile exists or not
  if (!videoFile || !duration) {
    throw new ApiError(400, "VideoFile is Required");
  }
  // call the service
  const uploadVideo = await uploadVideoService(channel._id.toString(), {
    videoFile,
    duration,
  });
  // give back the response to the client
  res
    .status(200)
    .json(new ApiResponse(200, "Video uploaded Successfully", uploadVideo));
});

import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import {
  getSingleVideoService,
  getUploadSignatureService,
} from "../services/video.service";
import { ApiResponse } from "../utils/apiResponse";

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

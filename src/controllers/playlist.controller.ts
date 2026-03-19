import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { getSinglePlaylistService } from "../services/playlist.service";
import { ApiResponse } from "../utils/apiResponse";

export const getSinglePlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    // get the playlistId and user Id
    const { playlistId } = req.params;
    // check if the playlistId exists or not
    if (!playlistId) {
      throw new ApiError(401, "Playlist ID is required");
    }

    const userId = req.user?._id;
    // get page and limit from query
    const { page, limit } = req.query;

    // call the service
    const playlist = await getSinglePlaylistService(
      playlistId,
      Number(page),
      Number(limit),
      userId?.toString()
    );
    // give back the response to the client
    res
      .status(200)
      .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
  }
);

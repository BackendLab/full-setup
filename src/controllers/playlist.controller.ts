import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import {
  createPlaylistService,
  getSinglePlaylistService,
} from "../services/playlist.service";
import { ApiResponse } from "../utils/apiResponse";
import { templateLiteral } from "zod";

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

// Create Playlist
export const createPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    // get the userId
    const userId = req.user?._id;
    // check if the user exists or not
    if (!userId) {
      throw new ApiError(401, "Unauthorized Resquest");
    }
    // get the Playlist data from req.body
    const { title, description, visibility } = req.body;
    // check if the data is missing or not
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Title is required");
    }
    // call the service
    const createdPlaylist = await createPlaylistService(
      userId.toString(),
      title,
      description,
      visibility
    );
    // give back the reposne to the client
    res
      .status(201)
      .json(
        new ApiResponse(201, "Playlist created successfully", createdPlaylist)
      );
  }
);

import { Playlist } from "../models/playlist.model";
import { PlaylistVideo } from "../models/playlistVideo.model";
import { VideoVisibility } from "../models/video.model";
import { ApiError } from "../utils/apiError";

export const getSinglePlaylistService = async (
  playlistId: string,
  page: number,
  limit: number,
  userId?: string
) => {
  // get the palylist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found");
  }
  // check ownership - what this does if the userId exists only then check
  const isOwner = !!userId && playlist.owner.toString() === userId;
  // check visibility
  if (playlist.visibility === "PRIVATE" && !isOwner) {
    throw new ApiError(403, "Access Denied");
  }
  // calculate offset pagination
  const skip = (page - 1) * limit;

  // get every playlistVideo
  const [playlistVideos, totalPlaylistVideos]: [any[], number] = // [any[], number] is used to give type safety to totalPlaylistVideos cause it was showing undefined. NOTE: this solution is given by chatgpt and I don't know what the fuck is this "yet".
    await Promise.all([
      PlaylistVideo.find({ playlist: playlistId })
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit)
        .populate("video"),

      PlaylistVideo.countDocuments({ playlist: playlistId }),
    ]);

  // calculate totalvideos and total pages
  const totalPages = Math.ceil(totalPlaylistVideos / limit);
  // return the response
  return {
    playlist: {
      _id: playlist._id,
      titlae: playlist.title,
      description: playlist.description,
      visibility: playlist.visibility,
      createdAt: playlist.createdAt,
    },
    videos: playlistVideos.map((pv) => pv.video), // extract videos from playlistVideos
    pagination: {
      page,
      limit,
      totalPlaylistVideos,
      totalPages,
      currentpage: page,
      hasNextpage: page < totalPages,
    },
    isOwner,
  };
};

// Create Playlist
export const createPlaylistService = async (
  // get the data from user
  userId: string,
  title: string,
  visibility: string,
  description?: string
) => {
  // create the playlist
  const playlistCreated = await Playlist.create({
    owner: userId,
    title,
    description,
    visibility,
  });
  // return the created Playlist
  return playlistCreated;
};

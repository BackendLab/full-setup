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

// add video to playlist
export const addVideoService = async (
  // get the id's
  playlistId: string,
  videoId: string,
  userId: string
) => {
  try {
    // get the playlist and update the video counter
    const playlist = await Playlist.findByIdAndUpdate(
      { _id: playlistId, owner: userId },
      { $inc: { videoCount: 1 } },
      { new: true }
    );
    // check if the playlist exists or not
    if (!playlist) {
      throw new ApiError(404, "Playlist Not Found!");
    }
    // calculate the positon of video
    const position = playlist.videoCount;
    // create the playlist video
    const addPlaylistVideo = await PlaylistVideo.create({
      playlist: playlistId,
      video: videoId,
      position,
    });
    // return the playlist video
    return addPlaylistVideo;
  } catch (error: any) {
    // check if the video is already there then update the video count and throw error
    if (error.code === 11000) {
      await Playlist.findByIdAndUpdate(playlistId, {
        $inc: { videoCount: -1 },
      });
      throw new ApiError(400, "Video already in playlist");
    }
    throw error;
  }
};

// Delete video from playlist
export const deleteVideoService = async (
  // get the id's
  playlistId: string,
  videoId: string,
  userId: string
) => {
  // find the playlist and check ownership
  const playlist = await Playlist.findById({
    playlist: playlistId,
    owner: userId,
  });
  // check if the playlist exists or not
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found!");
  }
  // Delete the video from playlist
  await PlaylistVideo.deleteOne({
    playlist: playlistId,
    videoId,
  });
  // decrement video count from playlist
  await Playlist.findByIdAndUpdate(playlistId, { $inc: { videoCount: -1 } });

  return;
};

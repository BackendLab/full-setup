import { Types } from "mongoose";
import { Channel } from "../models/channel.model";
import { ApiError } from "../utils/apiError";
import { Subscription } from "../models/subscription.model";
import { Playlist } from "../models/playlist.model";
import { User } from "../models/user.model";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";

interface ChannelProfileResult {
  channel: {
    id: string;
    name: string;
    handle: string;
    bio: string;
    avatar: string;
    coverImage: string;
    subscribersCount: number;
  };
  isSubscribed: boolean;
  featuredPlaylist: Array<{
    _id: string;
    title: string;
    videos: Array<{
      _id: string;
      title: string;
      desription: string;
      thumbnail: string;
      duration: number;
      channel: {
        _id: string;
        name: string;
      };
      views: number;
      createdAt: Date;
    }>;
  }>;
}

export const getChannelProfileService = async (
  viewerId: string,
  channelId: string
): Promise<ChannelProfileResult> => {
  // get the channel and viewer Id and cover it to ObjectId
  const channelObjectId = new Types.ObjectId(channelId);

  const viewerObjectId = new Types.ObjectId(viewerId);
  // fetch the channel
  const channel = await Channel.findOne({
    _id: channelObjectId,
    status: "ACTIVE",
  });
  // check if the channel exist or not
  if (!channel) {
    throw new ApiError(404, "Channle not found");
  }
  // check if the viewer subscribed to this channel or not
  let isSubscribed = false;

  if (viewerObjectId) {
    // NOTE: This !! is a Double Negation or Boolean casting. This does only 1 thing is to covert any value into a "strict boolean"
    const subscriptionExists = !!(await Subscription.exists({
      channel: channelObjectId,
      subscriber: viewerObjectId,
    }));

    isSubscribed = subscriptionExists;
  }
  // add playlist with videos - Aggregation Pipeline
  const featuredPlaylist = await Playlist.aggregate([
    // Stage 1 - get the recent playlist from the channel, channel must be active
    {
      $match: {
        channel: channelObjectId,
        state: "ACTIVE",
      },
    },
    // Stage 2 - sort Playlist by the lastest first
    {
      $sort: { createdAt: -1 },
    },
    // Stage 3 - get limited playlist
    {
      $limit: 5,
    },
    // Stage 4 - get all the videos from that single playlist
    {
      $lookup: {
        from: "videos",
        let: {
          playlistId: "$_id",
        },
        // Stage 5 - create a subs pipeline to fetch videos
        pipeline: [
          {
            // Stage 6 - get the videos from that selected playlist
            $match: {
              // Stage 7 - fetch the videos where Playlist, state and visibility are Active & Public
              $expr: {
                $and: [
                  { $eq: ["$playlist", "$$playlistId"] },
                  { $eq: ["$visibility", "PUBLIC"] },
                  { $eq: ["$state", "ACTIVE"] },
                ],
              },
            },
          },
          // Stage 8 - Add channel field to every video
          {
            $addFields: {
              channel: {
                id: channel._id,
                name: channel.name,
              },
            },
          },
          // Stage 9 - sort them by the latest first
          { $sort: { createdAt: -1 } },
          // Stage 10 - limit videos by 12 per playlist
          { $limit: 12 },
          // Stage 11 - project videos for response
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              channel: 1,
              createdAt: 1,
            },
          },
        ],
        as: "videos",
      },
    },
    // Stage 12 - project playlist for response
    {
      $project: {
        title: 1,
        videos: 1,
      },
    },
  ]);
  // return the result
  return {
    channel: {
      id: channel._id.toString(),
      name: channel.name,
      handle: channel.handle,
      bio: channel.bio,
      avatar: channel.avatar?.url ?? "",
      coverImage: channel.coverImage?.url ?? "",
      subscribersCount: channel.subscriberCount,
    },
    isSubscribed,
    featuredPlaylist,
  };
};
// NOTE: This "??" operator is nullish coalescing operator - which means, If the left side is null or undefined, use the right side

// Update Avatar Service
export const updateAvatarService = async (
  channelId: string,
  userId: string,
  filepath: string
) => {
  // find the channel, user using channelId and userId
  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new ApiError(401, "Channel not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  // check the ownership of user with channel -> check channel.owner = user or not
  if (channel?.owner.toString() !== userId) {
    throw new ApiError(403, "Not allowed to update this channel");
  }
  // upload new avatar
  const uploadedAvatar = await uploadToCloudinary(filepath);
  // check if the avatar file uploaded or not
  if (
    !uploadedAvatar ||
    !uploadedAvatar.secure_url ||
    !uploadedAvatar.public_id
  ) {
    throw new ApiError(500, "Avatar uploaded failed");
  }
  // if uploading successfull delete the old avatar file
  if (channel.avatar.publicId) {
    await deleteFromCloudinary(channel.avatar.publicId);
  }
  // update the channel avatar and user avatar and save them to DB
  const newAvatar = {
    url: uploadedAvatar.secure_url,
    publicId: uploadedAvatar.public_id,
  };

  channel.avatar = newAvatar;
  user.avatar = newAvatar;

  // save the updated avatar in DB at once
  await Promise.all([
    channel.save({ validateBeforeSave: false }),
    user.save({ validateBeforeSave: false }),
  ]);
  // return the updated avatar
  return { url: newAvatar.url, publicId: newAvatar.publicId };
};

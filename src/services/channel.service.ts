import { Types } from "mongoose";
import { Channel } from "../models/channel.model";
import { ApiError } from "../utils/apiError";
import { Subscription } from "../models/subscription.model";
import { Playlist } from "../models/playlist.model";
import { title } from "process";

export const getChannelProfileService = async (
  viewerId: string,
  channelId: string
) => {
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
          // Stage 8 - sort them by the latest first
          { $sort: { createdAt: -1 } },
          // Stage 9 - limit videos by 12 per playlist
          { $limit: 12 },
          // Stage 10 - project videos for response
          {
            $project: {
              title: 1,
              desription: 1,
              thumbnail: 1,
              duration: 1,
              channel: 1,
              views: 1,
              createdAt: 1,
            },
          },
        ],
        as: "videos",
      },
    },
    // Stage 11 - project playlist for response
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
      avatar: channel.avatar,
      coverImage: channel.coverImage,
      subscribersCount: channel.subscriberCount,
    },
    isSubscribed,
    featuredPlaylist,
  };
};

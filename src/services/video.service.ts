import { Subscription } from "../models/subscription.model";
import { Video } from "../models/video.model";
import { ApiError } from "../utils/apiError";

interface ChannelProfile {
  _id: string;
  name: string;
  avatar: string;
  subscribersCount: number;
}

interface VideoResult {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    tags: Array<string>;
    createdAt: Date;
    stats: {
      views: number;
      likesCount: number;
      commentsCount: number;
    };
    channel: ChannelProfile;
  };
  isSubscribed: boolean;
}

export const getSingleVideoService = async (
  // get the id's
  videoId: string,
  viewerId?: string
): Promise<VideoResult> => {
  // find the video which is ready and visible and populate channel with it
  const video = await Video.findOne({
    _id: videoId,
    visibility: "PUBLIC",
    status: "READY",
  })
    .select(
      "videoFile title description thumbnail duration tags views likesCount commentsCount channel"
    )
    .populate<{ channel: ChannelProfile }>({
      path: "channel",
      select: "name avatar subscribersCount",
    });
  // check if the video exists or not
  if (!video) {
    throw new ApiError(404, "Video Not Found!");
  }
  // check if the viewer subscribed to this channel or not
  let isSubscribed = false;

  if (viewerId) {
    const subscriptionExists = !!(await Subscription.exists({
      channel: video.channel._id,
      subscriber: viewerId,
    }));

    isSubscribed = subscriptionExists;
  }

  return {
    video: {
      id: video._id.toString(),
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: video.duration,
      tags: video.tags,
      createdAt: video.createdAt,
      stats: {
        views: video.views,
        likesCount: video.likesCount,
        commentsCount: video.commentsCount,
      },
      channel: {
        _id: video.channel._id.toString(),
        name: video.channel.name,
        avatar: video.channel.avatar,
        subscribersCount: video.channel.subscribersCount,
      },
    },
    isSubscribed,
  };
};

import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Channel } from "../models/channel.model";
import { ApiError } from "../utils/apiError";
import { Subscription } from "../models/subscription.model";

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
    // NOTE: This !! is
    const subscriptionExists = !!(await Subscription.exists({
      channel: channelObjectId,
      subscriber: viewerObjectId,
    }));

    isSubscribed = subscriptionExists;
  }
  // add playlist with videos - Aggregation Pipeline
  // return the result
};

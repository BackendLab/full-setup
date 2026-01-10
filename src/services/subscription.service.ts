import { Types } from "mongoose";
import { Subscription } from "../models/subscription.model";
import { ApiError } from "../utils/apiError";

export const subscribeService = async (
  // get both the ID's as params
  subscriberId: string,
  channelId: string
): Promise<void> => {
  // check if the user subscribed to itself
  if (subscriberId === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }
  // create subscriber and chennel relationship
  try {
    await Subscription.create({
      subscriber: new Types.ObjectId(subscriberId),
      channel: new Types.ObjectId(channelId),
    });
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError(409, "Already subscribed");
    }
    throw error;
  }
};

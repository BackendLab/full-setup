import { Types } from "mongoose";
import { Subscription } from "../models/subscription.model";
import { ApiError } from "../utils/apiError";

// Subscribe Service
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

// Unsubscribe Service
export const unsubscribeService = async (
  subscriberId: string,
  channelId: string
): Promise<void> => {
  try {
    // find the user and delete the relationship
    const result = await Subscription.findOneAndDelete({
      subscriber: subscriberId,
      channel: channelId,
    });

    //   check if the relationship exists or not
    if (!result) {
      throw new ApiError(404, "Subscription Not Found");
    }
  } catch (error) {
    throw error;
  }
};

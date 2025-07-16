import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/subscriptions";

export const getAllSubscriptionType = async () => {
  try {
    const res = await get(API + "/type");
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};
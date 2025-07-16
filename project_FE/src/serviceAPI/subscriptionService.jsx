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

export const checkPay = async (params) => {
  try {
    const res = await post(API + '/check-pay', params);
    return res.data;
  } catch (error) {
    if (error.response) {
        console.error("Error response from server:", error.response.data);
        return error.response.data;
    } else {
        console.error("Unexpected error:", error);
        return { status: "Fail", message: "Unexpected error occurred.", data: null };
    }
  }
};
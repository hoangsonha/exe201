import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/hashtags";

export const getHashtags = async () => {
  try {
    const res = await get(API + "/non-paging");
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

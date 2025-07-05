import { get, post, put, remove } from "../utils/request"

const API = "/api/reports"

export const reportReview = async (reviewId, params) => {
  try {
    const res = await post(`${API}/reviews/${reviewId}`, params);
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
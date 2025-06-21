import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/reviews";

export const getTopTradingGlobal = async () => {
  try {
    const res = await get(API + "/top-trending");
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const searchReview = async (searchTerm, selectedCategories) => {
  try {
    const params = {
      search: searchTerm,
      hashtags: selectedCategories.join(',')
    };
    const res = await get(API + "/search", { params });
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const createReview = async (formData) => {
  try {
    const res = await post(API, formData,  
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
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

export const getReviewById = async (id) => {
  try {
    const res = await get(`${API}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting review:", error);
    return { status: "Fail", message: "Failed to get review", data: null };
  }
};

export const saveReview = async (params) => {
  try {
    const res = await post(`${API}/saved`, params);
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

export const unSaveReview = async (params) => {
  try {
    const res = await post(`${API}/unsaved`, params);
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
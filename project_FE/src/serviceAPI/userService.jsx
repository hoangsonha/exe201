import { get, post, put, remove } from "../utils/request";

const API = "/api/v1/users";

const API_ROLE = "/api/v1/roles";

export const createHashtagUser = async (params) => {
  try {
    const res = await post(API + '/hashtags', params);
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

export const createImageUser = async (params) => {
  try {
    const res = await post(API + '/image', params);
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



export const getEmployeePaging = async (params) => {
  try {

    const res = await get(API, { params: params });
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const search = async (params) => {
  try {

    const res = await get(API + '/search', { params: params });
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};


export const getEmployees = async () => {
  try {
    const res = await get(API + "/non-paging");
    return res;
  } catch (error) {
        console.log(error);
        return [];
    }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await get(`${API}/${id}`);
    return res.data;
  } catch (e) {
    console.error("Lỗi khi getEmployee:", e);
  }
};

export const getRoles = async () => {
  try {
    const res = await get(API_ROLE);
    return res;
  } catch (e) {
    console.error("Lỗi khi getRole:", e);
    return [];
  }
};

export const createEmployee = async (params) => {
  try {
    const res = await post(API, params);
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

export const updateEmployee = async (params, id) => {
  try {
    const res = await put(`${API}/${id}`, params);
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

export const deleteEmployee = async (id) => {
  try {
    const res = await remove(`${API}/${id}`);
    return res.data.data;
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

export const restoreEmployee = async (id) => {
  try {
    const res = await post(`${API}/${id}/restore`);
    return res.data.data;
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

export const getUserById = async (id) => {
  try {
    const res = await get(`${API}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { status: "Fail", message: "Failed to get user profile", data: null };
  }
};

export const getUserPosts = async (id) => {
  try {
    const res = await get(`${API}/${id}/my-reviews`);
    return res.data;
  } catch (error) {
    console.error("Error getting user posts:", error);
    return { status: "Fail", message: "Failed to get user posts", data: null };
  }
};

export const getUserComments = async (id) => {
  try {
    const res = await get(`${API}/${id}/comments`);
    return res.data;
  } catch (error) {
    console.error("Error getting user comments:", error);
    return { status: "Fail", message: "Failed to get user comments", data: null };
  }
};

export const getUserLikedPosts = async (id) => {
  try {
    const res = await get(`${API}/${id}/likes`);
    return res.data;
  } catch (error) {
    console.error("Error getting user liked posts:", error);
    return { status: "Fail", message: "Failed to get user liked posts", data: null };
  }
};

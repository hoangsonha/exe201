import { post } from '../utils/request';

const API_URL = `/api/v1/public`;

export const login = async (params = {}) => {
    try {
        const response = await post(API_URL + '/login', params);

        return response;
    } catch (error) {
        console.log('Error at LoginApi:', error);
    }
};

export const register = async (params = {}) => {
    try {
        const response = await post(API_URL + '/register', params);

        return response;
    } catch (error) {
        console.log('Error at LoginApi:', error);
    }
};

export const verificationCodeAPi = async (params = {}) => {
    try {
        const response = await post(API_URL + '/register/verification', params);

        return response;
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




import { post } from '../utils/request';

const API_URL = `/api/v1/public/login`;

export const login = async (params = {}) => {
    try {
        const response = await post(API_URL, params);

        return response;
    } catch (error) {
        console.log('Error at LoginApi:', error);
    }
};




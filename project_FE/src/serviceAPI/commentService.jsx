import { get } from '../utils/request';

const API_URL = `/api/v1/comments`;

export const getCommentByUserId = async (userId) => {
    try {
        const response = await get(`${API_URL}/by-user?userId=${userId}`)
        return response
    } catch (error) {
        console.log('Error at:', error)
    }
}

export const getParentCommentByCommentId = async (commentId) => {
    try {
        const response = await get(`${API_URL}/parent?commentId=${commentId}`)
        return response
    } catch (error) {
        console.log('Error at:', error)
    }
}
import { post } from '../utils/request'

const API_URL = `/api/v1/ratings`

export const createRating = async (userId, reviewId, stars) => {
  try {
    const response = await post(
      `${API_URL}/create?userId=${userId}&reviewId=${reviewId}&stars=${stars}`
    )
    return response
  } catch (error) {
    console.log('Error at createRating:', error)
    throw error
  }
}

import { post } from '../utils/request'

const API_URL = `/api/v1/likes`

export const toggleLike = async (targetType, targetId) => {
  try {
    const response = await post(
      `${API_URL}/togglelike?targetType=${targetType}&targetId=${targetId}`
    )
    return response
  } catch (error) {
    console.log('Error at toggleLike:', error)
  }
}

export const toggleHeart = async (targetType, targetId) => {
  try {
    const response = await post(
      `${API_URL}/toggle-heart?targetType=${targetType}&targetId=${targetId}`
    )
    return response
  } catch (error) {
    console.log('Error at toggleHeart:', error)
  }
}

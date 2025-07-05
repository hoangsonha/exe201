import { get, post } from '../utils/request'

const API_URL = `/api/v1/notifications`

export const getMyNotifications = async () => {
  try {
    const response = await get(`${API_URL}/my-notifications`)
    return response
  } catch (error) {
    console.log('Error fetching my notifications:', error)
  }
}

export const getMyUnreadNotifications = async () => {
  try {
    const response = await get(`${API_URL}/my-unread-notifications`)
    return response
  } catch (error) {
    console.log('Error fetching my unread notifications:', error)
  }
}

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await patch(`${API_URL}/${notificationId}/read`)
    return response
  } catch (error) {
    console.log('Error marking notification as read:', error)
  }
}

import { api } from './api.js';

const NOTIFICATIONS_ENDPOINT = 'api/open/notifications';

/**
 * Fetch all notifications for a specific user ID
 * Endpoint: GET /api/open/notifications/user/{userId}
 * @param {number|string} [userId]
 * @returns {Promise<Array<Object>>}
 */
export const getUserNotifications = async (userId) => {
  try {
    const id = Number(userId || localStorage.getItem('userId'));

    if (!id) {
      throw new Error('User ID is required to fetch notifications.');
    }

    // Calls GET https://donnerkonnect.onrender.com/api/open/notifications/user/{userId}
    const response = await api.get(`${NOTIFICATIONS_ENDPOINT}/user/${id}`);
    return response?.data || [];
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to fetch notifications.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

/**
 * Mark a single notification as read
 * Endpoint: PATCH /api/open/notifications/{id}/read
 * @param {number|string} notificationId
 * @returns {Promise<Object>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    if (!notificationId) {
      throw new Error('Notification ID is required.');
    }

    // Calls PATCH https://donnerkonnect.onrender.com/api/open/notifications/{id}/read
    const response = await api.patch(`${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`);
    return response?.data || response;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to mark notification as read.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

export const notificationService = {
  getUserNotifications,
  markNotificationAsRead,
};

export default notificationService;
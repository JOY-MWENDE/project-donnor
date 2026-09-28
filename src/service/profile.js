import { api } from './api.js';

const PROFILE_BASE_ENDPOINT = 'api/open/users';

/**
 * Fetch a user profile by ID.
 * Defaults to the stored userId in localStorage if no ID is passed.
 *
 * @param {number|string} [id] - The user ID (e.g., 4)
 * @returns {Promise<{
 *   id: number,
 *   fullName: string,
 *   email: string,
 *   bloodGroup: string,
 *   gender: string,
 *   phoneNumber: string,
 *   cityLocation: string
 * }>}
 */
export const getUserProfile = async (id) => {
  const userId = id || localStorage.getItem('userId');

  if (!userId) {
    throw new Error('User ID is required to fetch profile.');
  }

  try {
    // Calls GET https://donnerkonnect.onrender.com/api/open/users/{id}
    const data = await api.get(`${PROFILE_BASE_ENDPOINT}/${userId}`);

    // Update stored user profile in localStorage to keep cache fresh
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load user profile.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

export const profileService = {
  getUserProfile,
};

export default profileService;
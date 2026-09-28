import { api } from './api.js';

const REGISTER_ENDPOINT = 'api/open/users/register';

/**
 * Register a new user
 * @param {Object} userData
 * @param {string} userData.fullName
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.bloodGroup - e.g., "O+", "A-", "B+"
 * @param {string} userData.gender - e.g., "Male", "Female"
 * @param {string} userData.phoneNumber
 * @param {string} userData.cityLocation
 * @returns {Promise<Object>} Created user details without password
 */
export const registerUser = async (userData) => {
  try {
    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      bloodGroup: userData.bloodGroup,
      gender: userData.gender,
      phoneNumber: userData.phoneNumber,
      cityLocation: userData.cityLocation,
    };

    const response = await api.post(REGISTER_ENDPOINT, payload);
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      'Registration failed. Please check your details and try again.';
    
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }
};

export const registrationService = {
  register: registerUser,
};

export default registrationService;
import { api } from './api.js';

const EMERGENCIES_ENDPOINT = 'api/open/emergencies';

/**
 * Fetch emergency blood requests
 * Endpoint: GET /api/open/emergencies?activeOnly={boolean}
 * @param {boolean} [activeOnly=true] - Filter to active emergencies only
 * @returns {Promise<Array<{
 *   id: number,
 *   hospitalUserId: number,
 *   hospitalName: string,
 *   bloodGroup: string,
 *   unitsRequired: number,
 *   urgencyLevel: string,
 *   location: string,
 *   contactNumber: string,
 *   status: string,
 *   createdAt: string
 * }>>}
 */
export const getEmergencies = async (activeOnly = true) => {
  try {
    // Calls GET https://donnerkonnect.onrender.com/api/open/emergencies?activeOnly=true
    const response = await api.get(EMERGENCIES_ENDPOINT, {
      params: { activeOnly },
    });

    return response?.data || [];
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to fetch emergency requests.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

/**
 * Create and broadcast a new emergency blood request
 * Endpoint: POST /api/open/emergencies
 * @param {Object} emergencyData
 * @param {number|string} [emergencyData.hospitalUserId] - Defaults to userId stored in localStorage
 * @param {string} emergencyData.hospitalName
 * @param {string} emergencyData.bloodGroup
 * @param {number} emergencyData.unitsRequired
 * @param {string} emergencyData.location
 * @param {string} emergencyData.contactNumber
 * @param {string} emergencyData.urgencyLevel - e.g. "CRITICAL", "URGENT", "NORMAL"
 * @returns {Promise<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     id: number,
 *     hospitalUserId: number,
 *     hospitalName: string,
 *     bloodGroup: string,
 *     unitsRequired: number,
 *     location: string,
 *     contactNumber: string,
 *     urgencyLevel: string,
 *     status: string,
 *     createdAt: string
 *   }
 * }>}
 */
export const createEmergency = async (emergencyData) => {
  try {
    const hospitalUserId = Number(
      emergencyData.hospitalUserId || localStorage.getItem('userId')
    );

    if (!hospitalUserId) {
      throw new Error('User ID is required to post an emergency request.');
    }

    const payload = {
      hospitalUserId,
      hospitalName: emergencyData.hospitalName,
      bloodGroup: emergencyData.bloodGroup,
      unitsRequired: Number(emergencyData.unitsRequired) || 1,
      location: emergencyData.location,
      contactNumber: emergencyData.contactNumber,
      urgencyLevel: (emergencyData.urgencyLevel || 'URGENT').toUpperCase(),
    };

    // Calls POST https://donnerkonnect.onrender.com/api/open/emergencies
    const response = await api.post(EMERGENCIES_ENDPOINT, payload);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to create emergency blood request.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

export const emergencyService = {
  getEmergencies,
  createEmergency,
};

export default emergencyService;
import { api } from './api.js';

const DONATIONS_ENDPOINT = 'api/open/donations';

/**
 * Record a new blood donation
 * @param {Object} donationData
 * @param {number|string} [donationData.userId] - Defaults to stored userId in localStorage if omitted
 * @param {string} donationData.hospital - e.g. "Kenyatta"
 * @param {string} donationData.donationDate - Format: "YYYY-MM-DD"
 * @param {string} donationData.donationTime - Format: "HH:mm:ss"
 * @param {string} donationData.bloodGroup - e.g. "AB", "O+", "B-"
 * @param {number} [donationData.unitsDonated=1]
 * @param {string} donationData.location - e.g. "Garden Estate"
 * @returns {Promise<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     id: number,
 *     userId: number,
 *     donorName: string,
 *     hospital: string,
 *     donationDate: string,
 *     donationTime: string,
 *     bloodGroup: string,
 *     unitsDonated: number,
 *     location: string,
 *     nextEligibleDate: string,
 *     status: string
 *   }
 * }>}
 */
export const recordDonation = async (donationData) => {
  try {
    const userId = Number(donationData.userId || localStorage.getItem('userId'));

    if (!userId) {
      throw new Error('User ID is required to record a donation.');
    }

    const payload = {
      userId,
      hospital: donationData.hospital,
      donationDate: donationData.donationDate,
      donationTime: donationData.donationTime.length === 5 
        ? `${donationData.donationTime}:00` 
        : donationData.donationTime,
      bloodGroup: donationData.bloodGroup,
      unitsDonated: Number(donationData.unitsDonated) || 1,
      location: donationData.location,
    };

    // Calls POST https://donnerkonnect.onrender.com/api/open/donations
    const response = await api.post(DONATIONS_ENDPOINT, payload);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to record donation.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

/**
 * Fetch blood donation history for a specific user ID
 * @param {number|string} [userId] - Defaults to stored userId in localStorage if omitted
 * @returns {Promise<Array<{
 *   id: number,
 *   userId: number,
 *   donorName: string,
 *   hospital: string,
 *   donationDate: string,
 *   donationTime: string,
 *   bloodGroup: string,
 *   unitsDonated: number,
 *   location: string,
 *   nextEligibleDate: string,
 *   status: string
 * }>>}
 */
export const getUserDonations = async (userId) => {
  try {
    const id = Number(userId || localStorage.getItem('userId'));

    if (!id) {
      throw new Error('User ID is required to fetch donation history.');
    }

    // Calls GET https://donnerkonnect.onrender.com/api/open/donations/user/{userId}
    const response = await api.get(`${DONATIONS_ENDPOINT}/user/${id}`);
    return response?.data || [];
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to fetch donation history.';

    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
};

export const donationService = {
  recordDonation,
  getUserDonations,
};

export default donationService;
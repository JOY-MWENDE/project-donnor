import { api } from './api.js';

const LOGIN_ENDPOINT = 'api/open/users/login';

/**
 * Utility function to parse the JWT payload without external libraries
 * @param {string} token
 * @returns {Object|null}
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

/**
 * Logs in a user and saves auth state to localStorage
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{ token: string, id: number, user: Object }>}
 */
export const loginUser = async ({ email, password }) => {
  try {
    const payload = {
      email: email.trim(),
      password,
    };

    // Calls POST https://donnerkonnect.onrender.com/api/open/users/login
    const data = await api.post(LOGIN_ENDPOINT, payload);

    if (data?.token) {
      // Extract profile claims contained inside the JWT
      const decodedUser = decodeToken(data.token);

      // Persist auth token and user profile
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      if (decodedUser) {
        localStorage.setItem('user', JSON.stringify(decodedUser));
      }

      return {
        token: data.token,
        id: data.id,
        user: decodedUser,
      };
    }

    throw new Error('Invalid response structure from server.');
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      (error.response?.status === 401 ? 'Invalid email or password.' : null) ||
      error.message ||
      'Login failed. Please check your credentials.';

    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }
};

/**
 * Clears stored credentials and logs out the user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
};

/**
 * Retrieves the currently saved token
 * @returns {string|null}
 */
export const getStoredToken = () => localStorage.getItem('token');

/**
 * Retrieves the saved user profile decoded from the JWT
 * @returns {Object|null}
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const authService = {
  login: loginUser,
  logout: logoutUser,
  getToken: getStoredToken,
  getUser: getStoredUser,
  decodeToken,
};

export default authService;
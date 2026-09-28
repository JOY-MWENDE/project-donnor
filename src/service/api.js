import axios from 'axios';

// Base server URL configured for all services
export const BASE_URL = 'https://donnerkonnect.onrender.com/';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (e.g., attach auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (centralized error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - redirecting or clearing session');
    }
    return Promise.reject(error);
  }
);

// Helper methods returning data directly
export const api = {
  get: (url, config) => apiClient.get(url, config).then((res) => res.data),
  post: (url, data, config) => apiClient.post(url, data, config).then((res) => res.data),
  put: (url, data, config) => apiClient.put(url, data, config).then((res) => res.data),
  patch: (url, data, config) => apiClient.patch(url, data, config).then((res) => res.data),
  delete: (url, config) => apiClient.delete(url, config).then((res) => res.data),
};

export default apiClient;
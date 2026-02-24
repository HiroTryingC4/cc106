// API Configuration
// This will automatically use the production API URL when deployed
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default {
  API_URL,
  // Add other configuration as needed
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
};

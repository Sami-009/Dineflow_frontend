// authService.js
import api from './api';

/**
 * Sign up a new user
 * @param {object} data - { name, email, password, address, city, latitude?, longitude? }
 */
export const signup = async (data) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

/**
 * Log in an existing user
 * @param {object} data - { email, password }
 */
export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export default {
  signup,
  login,
};

// menuService.js
import api from './api';

/**
 * Fetch menu items from API
 * @param {boolean} showAll - True to fetch all items (including unavailable, for admin), false/undefined for available only
 */
export const getMenuItems = async (showAll = false) => {
  const response = await api.get(`/menu${showAll ? '?all=true' : ''}`);
  return response.data;
};

/**
 * Add a new menu item
 * @param {object} data - { name, description, price, category, is_available, image_url }
 * @param {string} token - JWT Admin Token
 */
export const addMenuItem = async (data, token) => {
  const response = await api.post('/menu', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Update an existing menu item
 * @param {number|string} id 
 * @param {object} data - Updated menu fields
 * @param {string} token - JWT Admin Token
 */
export const updateMenuItem = async (id, data, token) => {
  const response = await api.put(`/menu/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Delete a menu item
 * @param {number|string} id 
 * @param {string} token - JWT Admin Token
 */
export const deleteMenuItem = async (id, token) => {
  const response = await api.delete(`/menu/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Update availability of an existing menu item
 * @param {number|string} id 
 * @param {object} data - { is_available }
 * @param {string} token - JWT Admin Token
 */
export const updateMenuAvailability = async (id, data, token) => {
  const response = await api.put(`/menu/${id}/availability`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuAvailability,
};

import api from './api';

/**
 * Submit feedback for an order.
 * @param {object} data - { order_id, rating, comment }
 * @param {string} token - JWT Customer Token
 */
export const submitFeedback = async (data, token) => {
  const response = await api.post('/feedback', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get feedback for a specific order.
 * @param {number|string} orderId
 * @param {string} token
 */
export const getOrderFeedback = async (orderId, token) => {
  const response = await api.get(`/feedback/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get feedback summary for a menu item.
 * @param {number|string} menuItemId
 * @param {string} token
 */
export const getMenuFeedback = async (menuItemId, token) => {
  const response = await api.get(`/feedback/menu/${menuItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  submitFeedback,
  getOrderFeedback,
  getMenuFeedback,
};

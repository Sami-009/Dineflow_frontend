// orderService.js
import api from './api';

/**
 * Place a new order
 * @param {object} data - { items: [{ id, quantity }], payment_method, delivery_address, delivery_city, delivery_latitude?, delivery_longitude? }
 * @param {string} token - JWT Customer Token
 */
export const placeOrder = async (data, token) => {
  const response = await api.post('/orders', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get logged-in user's order history
 * @param {string} token - JWT Customer Token
 */
export const getMyOrders = async (token) => {
  const response = await api.get('/orders/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get all customer orders (Admin only)
 * @param {string} token - JWT Admin Token
 */
export const getAllOrders = async (token) => {
  const response = await api.get('/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Update the status of an order
 * @param {number|string} id 
 * @param {string} status - 'Pending' | 'Preparing' | 'Completed'
 * @param {string} token - JWT Admin Token
 */
export const updateOrderStatus = async (id, status, token) => {
  const response = await api.put(
    `/orders/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const cancelOrder = async (id, token) => {
  const response = await api.put(
    `/orders/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};

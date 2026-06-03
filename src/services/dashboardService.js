// dashboardService.js
import api from './api';

/**
 * Fetch admin dashboard summary statistics
 * @param {string} token - JWT Admin Token
 */
export const getDashboardSummary = async (token) => {
  const response = await api.get('/dashboard/summary', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getDashboardSummary,
};

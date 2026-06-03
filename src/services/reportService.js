import api from './api';

/**
 * Fetch report summary data for admin.
 * @param {string} token - JWT Admin Token
 */
export const getReportSummary = async (token) => {
  const response = await api.get('/reports/summary', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getReportSummary,
};

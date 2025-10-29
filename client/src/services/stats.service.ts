import api from './api';

/**
 * Fetches the dashboard statistics from the API.
 */
export const getDashboardStats = async () => {
  const res = await api.get('/stats/dashboard');
  return res.data;
};

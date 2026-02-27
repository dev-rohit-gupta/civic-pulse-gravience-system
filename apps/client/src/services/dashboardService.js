import api from './api';

export const getDashboardStats = async () => {
  return api.get('/api/dashboard/stats');
};

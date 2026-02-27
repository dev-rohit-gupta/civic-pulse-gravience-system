import api from './api';

export const getActivityLogs = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.page) queryParams.append('page', params.page);
  
  return api.get(`/api/activity?${queryParams.toString()}`);
};

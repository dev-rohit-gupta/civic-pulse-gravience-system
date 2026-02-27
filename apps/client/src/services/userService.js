import api from './api';

export const getAllOperators = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.page) queryParams.append('page', params.page);
  
  return api.get(`/api/users/operators?${queryParams.toString()}`);
};

export const createOperator = async (operatorData) => {
  return api.post('/api/users/operator', operatorData);
};

export const updateOperator = async (operatorId, updateData) => {
  return api.patch(`/api/users/operator/${operatorId}`, updateData);
};

export const deleteOperator = async (operatorId) => {
  return api.delete(`/api/users/operator/${operatorId}`);
};

export const getUserProfile = async () => {
  return api.get('/api/users/profile');
};

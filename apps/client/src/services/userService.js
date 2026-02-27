import api from './api';

// Operators
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

// Department Admins
export const getAllDepartmentAdmins = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.page) queryParams.append('page', params.page);
  
  return api.get(`/api/users/department-admins?${queryParams.toString()}`);
};

export const createDepartmentAdmin = async (adminData) => {
  return api.post('/api/users/department-admin', adminData);
};

export const updateDepartmentAdmin = async (adminId, updateData) => {
  return api.patch(`/api/users/department-admin/${adminId}`, updateData);
};

export const deleteDepartmentAdmin = async (adminId) => {
  return api.delete(`/api/users/department-admin/${adminId}`);
};

// Profile
export const getUserProfile = async () => {
  return api.get('/api/users/profile');
};


import api from './api';

export const getAllDepartments = async () => {
  const response = await api.get('/api/department');
  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await api.post('/api/department/create', departmentData);
  console.log('Create Department Response:', response);
  return response.data;
};

export const updateDepartment = async (id, departmentData) => {
  const response = await api.put(`/api/department/${id}`, departmentData);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/api/department/${id}`);
  return response.data;
};

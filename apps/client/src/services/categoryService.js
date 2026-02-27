import api from './api';

export const getAllCategories = async () => {
  const response = await api.get('/api/category');
  console.log('Fetched Categories:', response);  
  return response;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/api/category/create', categoryData);
  
  return response;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/api/category/${id}`, categoryData);
  
  return response;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/category/${id}`);
  
  return response;
};

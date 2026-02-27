import api from './api';

export const loginUser = async (credentials) => {
  const response = await api.post('/api/login', credentials);
  if (response.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  if (response.data?.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/register', userData);
  if (response.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  if (response.data?.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const getUserProfile = async () => {
  const response = await api.get('/api/users/profile');
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response;
};

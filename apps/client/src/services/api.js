// Base API configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Simple fetch wrapper
const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const config = {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
  };

  // Convert body to JSON if it's not FormData
  if (config.body && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config); 
    console.log(response)
    const data = await response.json();
    if (!response.ok) {
      // Handle errors
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw data;
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper methods
api.get = (url, options) => api(url, { ...options, method: 'GET' });
api.post = (url, data, options) => api(url, { ...options, method: 'POST', body: data });
api.put = (url, data, options) => api(url, { ...options, method: 'PUT', body: data });
api.patch = (url, data, options) => api(url, { ...options, method: 'PATCH', body: data });
api.delete = (url, options) => api(url, { ...options, method: 'DELETE' });

export default api;

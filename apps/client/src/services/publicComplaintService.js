import api from './api';

export const registerPublicComplaint = async (complaintData) => {
  const formData = new FormData();
  
  formData.append('name', complaintData.name);
  formData.append('mobile', complaintData.mobile);
  if (complaintData.aadhaar) formData.append('aadhaar', complaintData.aadhaar);
  if (complaintData.email) formData.append('email', complaintData.email);
  
  formData.append('category', complaintData.category);
  formData.append('subject', complaintData.subject);
  formData.append('description', complaintData.description);
  
  formData.append('city', complaintData.city);
  if (complaintData.ward) formData.append('ward', complaintData.ward);
  if (complaintData.address) formData.append('address', complaintData.address);
  if (complaintData.gps) formData.append('gps', JSON.stringify(complaintData.gps));
  
  if (complaintData.images?.length > 0) {
    complaintData.images.forEach((image) => formData.append('images', image));
  }
  
  return api.post('/api/public/complaint/register', formData);
};

export const trackComplaintByReference = async (referenceId) => {
  return api.get(`/api/public/complaint/track/${referenceId}`);
};

export const searchPublicComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.query) params.append('query', filters.query);
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.limit) params.append('limit', filters.limit);
  console.log('Searching public complaints with filters:', filters);
  return api.get(`/api/public/complaint/search?${params.toString()}`);
};

export const getPublicStats = async () => {
  const response = await searchPublicComplaints({ limit: 1000 });
  const complaints = response.data.data || [];
  
  return {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'inProgress').length,
  };
};

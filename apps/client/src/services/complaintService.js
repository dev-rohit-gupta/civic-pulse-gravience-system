import api from './api';

export const getAllComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.page) params.append('page', filters.page);
  
  return api.get(`/api/complaint?${params.toString()}`);
};

export const getComplaintDetails = async (complaintId) => {
  return api.get(`/api/complaint/${complaintId}`);
};

export const registerComplaint = async (complaintData) => {
  const formData = new FormData();
  formData.append('title', complaintData.title);
  formData.append('description', complaintData.description);
  formData.append('location', JSON.stringify(complaintData.location));
  if (complaintData.image) formData.append('file', complaintData.image);
  
  return api.post('/api/complaint/register', formData);
};

export const updateComplaintStatus = async (complaintId, statusData) => {
  return api.patch(`/api/complaint/${complaintId}`, statusData);
};

export const assignOperator = async (complaintId, operatorId) => {
  return api.patch(`/api/complaint/${complaintId}/assign`, { operatorId });
};

export const escalateComplaint = async (complaintId, reason) => {
  return api.post(`/api/complaint/${complaintId}/escalate`, { reason });
};

export const getEscalationHistory = async (complaintId) => {
  return api.get(`/api/complaint/${complaintId}/escalation-history`);
};

export const deleteComplaint = async (complaintId) => {
  return api.delete(`/api/complaint/${complaintId}`);
};

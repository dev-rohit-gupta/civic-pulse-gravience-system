import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getAllComplaints, registerComplaint, updateComplaintStatus, deleteComplaint, escalateComplaint } from '../services/complaintService';
import { getAllOperators, createOperator, updateOperator, deleteOperator } from '../services/userService';
import { getActivityLogs } from '../services/activityService';
import { getDashboardStats as fetchDashboardStats } from '../services/dashboardService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  // Get current user from localStorage
  const user = getCurrentUser();
  const [currentUser, setCurrentUser] = useState(user);
  const [role, setRole] = useState(user?.role || null);

  // STATE MANAGEMENT FOR ALL DATA
  const [complaints, setComplaints] = useState([]);
  const [operators, setOperators] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  // LOADING AND ERROR STATES
  const [isLoading, setIsLoading] = useState({
    complaints: false,
    operators: false,
    activities: false,
    dashboard: false
  });
  const [errors, setErrors] = useState({});

  // FETCH ALL DATA ON MOUNT
  useEffect(() => {
    if (user && user.role) {
      setRole(user.role);
      fetchComplaints();
      fetchOperators();
      fetchActivityLogs();
      fetchDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // FETCH FUNCTIONS
  const fetchComplaints = async (filters = {}) => {
    try {
      setIsLoading(prev => ({ ...prev, complaints: true }));
      const response = await getAllComplaints(filters);
      console.log('Fetched complaints:', response);
      setComplaints(response.data || []);
      setErrors(prev => ({ ...prev, complaints: null }));
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setErrors(prev => ({ ...prev, complaints: error.message || 'Failed to fetch complaints' }));
    } finally {
      setIsLoading(prev => ({ ...prev, complaints: false }));
    }
  };

  const fetchOperators = async (searchQuery = '') => {
    try {
      setIsLoading(prev => ({ ...prev, operators: true }));
      const response = await getAllOperators(searchQuery);
      setOperators(response.data || []);
      setErrors(prev => ({ ...prev, operators: null }));
    } catch (error) {
      console.error('Error fetching operators:', error);
      setErrors(prev => ({ ...prev, operators: error.message || 'Failed to fetch operators' }));
    } finally {
      setIsLoading(prev => ({ ...prev, operators: false }));
    }
  };

  const fetchActivityLogs = async (params = { limit: 50 }) => {
    try {
      setIsLoading(prev => ({ ...prev, activities: true }));
      const response = await getActivityLogs(params);
      setActivityLog(response.data || []);
      setErrors(prev => ({ ...prev, activities: null }));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setErrors(prev => ({ ...prev, activities: error.message || 'Failed to fetch activity logs' }));
    } finally {
      setIsLoading(prev => ({ ...prev, activities: false }));
    }
  };

  const fetchDashboard = async () => {
    try {
      setIsLoading(prev => ({ ...prev, dashboard: true }));
      const response = await fetchDashboardStats();
      setDashboardStats(response.data || null);
      setErrors(prev => ({ ...prev, dashboard: null }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setErrors(prev => ({ ...prev, dashboard: error.message || 'Failed to fetch dashboard stats' }));
    } finally {
      setIsLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // SHOW NOTIFICATION
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // COMPLAINT FUNCTIONS
  const handleAddComplaint = async (complaintForm) => {
    if (!complaintForm.description || !complaintForm.title) {
      showNotification('Please fill all required fields', 'error');
      return false;
    }
    
    try {
      const response = await registerComplaint(complaintForm);
      await fetchComplaints(); // Refresh complaints list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Complaint registered successfully!');
      return true;
    } catch (error) {
      console.error('Error registering complaint:', error);
      showNotification(error.message || 'Failed to register complaint', 'error');
      return false;
    }
  };

  const handleUpdateComplaint = async (complaintId, updateData) => {
    try {
      const response = await updateComplaintStatus(complaintId, updateData);
      await fetchComplaints(); // Refresh complaints list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Complaint updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating complaint:', error);
      showNotification(error.message || 'Failed to update complaint', 'error');
      return false;
    }
  };

  const handleDeleteComplaint = async (id) => {
    try {
      await deleteComplaint(id);
      await fetchComplaints(); // Refresh complaints list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Complaint deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      showNotification(error.message || 'Failed to delete complaint', 'error');
      return false;
    }
  };

  const handleEscalateComplaint = async (complaintId, reason) => {
    try {
      const response = await escalateComplaint(complaintId, reason);
      await fetchComplaints(); // Refresh complaints list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Complaint escalated successfully!');
      return true;
    } catch (error) {
      console.error('Error escalating complaint:', error);
      showNotification(error.message || 'Failed to escalate complaint', 'error');
      return false;
    }
  };

  // OPERATOR FUNCTIONS
  const handleAddOperator = async (operatorForm) => {
    if (!operatorForm.name || !operatorForm.email) {
      showNotification('Please fill all required fields', 'error');
      return false;
    }
    
    try {
      const response = await createOperator(operatorForm);
      await fetchOperators(); // Refresh operators list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Operator created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating operator:', error);
      showNotification(error.message || 'Failed to create operator', 'error');
      return false;
    }
  };

  const handleUpdateOperator = async (operatorId, updateData) => {
    try {
      const response = await updateOperator(operatorId, updateData);
      await fetchOperators(); // Refresh operators list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Operator updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating operator:', error);
      showNotification(error.message || 'Failed to update operator', 'error');
      return false;
    }
  };

  const handleDeleteOperator = async (id) => {
    try {
      await deleteOperator(id);
      await fetchOperators(); // Refresh operators list
      await fetchActivityLogs(); // Refresh activity logs
      showNotification('Operator deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting operator:', error);
      showNotification(error.message || 'Failed to delete operator', 'error');
      return false;
    }
  };

  // FILTERED AND SORTED DATA (Client-side filtering for search/sort)
  const getFilteredComplaints = (searchComplaint, filterPriority, filterStatus, sortBy) => {
    let filtered = complaints;

    // Note: Role-based filtering is now done on the backend
    // This function only handles search and sorting

    // Search filter
    if (searchComplaint) {
      filtered = filtered.filter(c => 
        c.complaintId?.toLowerCase().includes(searchComplaint.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchComplaint.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchComplaint.toLowerCase())
      );
    }

    if (filterPriority !== 'All') filtered = filtered.filter(c => c.priority === filterPriority);
    if (filterStatus !== 'All') filtered = filtered.filter(c => c.status === filterStatus);

    if (sortBy === 'priority') {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  const getDashboardStats = () => {
    // Return stats from backend (already role-filtered)
    if (dashboardStats) {
      return dashboardStats;
    }

    // Fallback to local calculation if backend data not loaded
    return {
      totalOperators: operators.length,
      activeOperators: operators.filter(o => o.status === 'Active').length,
      complaintsResolved: complaints.filter(c => c.status === 'Resolved').length,
      complaintsPending: complaints.filter(c => c.status === 'Pending').length,
      complaintsWorking: complaints.filter(c => c.status === 'Working').length,
      totalComplaints: complaints.length
    };
  };

  const getFilteredOperators = (searchOperator) => {
    let filtered = operators;

    // Note: Role-based filtering is now done on the backend
    // This function only handles search

    if (searchOperator) {
      filtered = filtered.filter(o => 
        o.name?.toLowerCase().includes(searchOperator.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchOperator.toLowerCase()) ||
        o.department?.toLowerCase().includes(searchOperator.toLowerCase())
      );
    }

    return filtered;
  };

  // Get filtered activity log (role-based filtering done on backend)
  const getFilteredActivityLog = () => {
    // Backend already filters based on role, just return the data
    return activityLog;
  };

  const value = {
    sidebarOpen,
    setSidebarOpen,
    notification,
    setNotification,
    showNotification,
    
    // User & Role
    role,
    setRole,
    currentUser,
    setCurrentUser,
    
    // Data
    complaints,
    operators,
    activityLog,
    dashboardStats,
    
    // Loading & Error States
    isLoading,
    errors,
    
    // Fetch Functions
    fetchComplaints,
    fetchOperators,
    fetchActivityLogs,
    fetchDashboard,
    
    // Complaint Functions
    handleAddComplaint,
    handleUpdateComplaint,
    handleDeleteComplaint,
    handleEscalateComplaint,
    
    // Operator Functions
    handleAddOperator,
    handleUpdateOperator,
    handleDeleteOperator,
    
    // Filter & Stats Functions
    getFilteredComplaints,
    getFilteredOperators,
    getFilteredActivityLog,
    getDashboardStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

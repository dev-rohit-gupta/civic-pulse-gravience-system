import React, { createContext, useContext, useState } from 'react';

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

  // role can be 'department', 'citizen', 'contractor', 'admin'
  const [role, setRole] = useState("citizen")
  // STATE MANAGEMENT FOR ALL DATA
  const [complaints, setComplaints] = useState([
    { id: 'CMP-1001', description: 'Pothole on Main Street', category: 'Road', priority: 'High', status: 'Pending', citizen: 'John Doe', assignedTo: null, dueDate: '2026-02-26', createdDate: '2026-02-24' },
    { id: 'CMP-1002', description: 'Power outage in Phase 2', category: 'Electrical', priority: 'Medium', status: 'Working', citizen: 'Jane Smith', assignedTo: 'Vikram Joshi', dueDate: '2026-02-27', createdDate: '2026-02-23' },
    { id: 'CMP-1003', description: 'Water pipeline burst', category: 'Water', priority: 'High', status: 'Pending', citizen: 'Ahmed Hassan', assignedTo: 'Sneha Kulkarni', dueDate: '2026-02-25', createdDate: '2026-02-22' },
    { id: 'CMP-1004', description: 'Garbage collection overdue', category: 'Sanitation', priority: 'Low', status: 'Resolved', citizen: 'Maria Garcia', assignedTo: 'Priya Sharma', dueDate: '2026-02-28', createdDate: '2026-02-21' },
    { id: 'CMP-1005', description: 'Street light broken', category: 'Road', priority: 'Medium', status: 'Working', citizen: 'David Lee', assignedTo: 'Raj Patil', dueDate: '2026-02-29', createdDate: '2026-02-20' }
  ]);

  const [contractors, setContractors] = useState([
    { id: 1, name: 'Raj Patil', department: 'Roads', status: 'Active', rating: 4.8, complaints: 12, city: 'Mumbai', phone: '9876543210', email: 'raj@civicpulse.in' },
    { id: 2, name: 'Sneha Kulkarni', department: 'Water', status: 'Active', rating: 4.6, complaints: 8, city: 'Pune', phone: '9876543211', email: 'sneha@civicpulse.in' },
    { id: 3, name: 'Vikram Joshi', department: 'Electrical', status: 'Active', rating: 4.9, complaints: 15, city: 'Bangalore', phone: '9876543212', email: 'vikram@civicpulse.in' },
    { id: 4, name: 'Priya Sharma', department: 'Sanitation', status: 'Active', rating: 4.5, complaints: 10, city: 'Mumbai', phone: '9876543213', email: 'priya@civicpulse.in' },
    { id: 5, name: 'Arjun Kumar', department: 'Parks', status: 'Inactive', rating: 4.2, complaints: 6, city: 'Delhi', phone: '9876543214', email: 'arjun@civicpulse.in' }
  ]);

  const [activityLog, setActivityLog] = useState([
    { id: 1, timestamp: '2026-02-24 14:32', action: 'Complaint Created', details: 'CMP-1001: Pothole reported by citizen', user: 'System' },
    { id: 2, timestamp: '2026-02-24 14:45', action: 'AI Validation', details: 'CMP-1001: Passed spam detection', user: 'AI Engine' },
    { id: 3, timestamp: '2026-02-24 15:00', action: 'Priority Assigned', details: 'CMP-1001: High Priority (Score: 85)', user: 'System' },
    { id: 4, timestamp: '2026-02-24 15:15', action: 'Department Assigned', details: 'CMP-1001: Assigned to Roads Dept', user: 'Admin' },
    { id: 5, timestamp: '2026-02-24 16:30', action: 'Contractor Assigned', details: 'CMP-1001: Assigned to Raj Patil', user: 'Department Admin' }
  ]);

  // SHOW NOTIFICATION
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // COMPLAINT FUNCTIONS
  const handleAddComplaint = (complaintForm) => {
    if (!complaintForm.description || !complaintForm.category || !complaintForm.citizen) {
      showNotification('Please fill all required fields', 'error');
      return false;
    }
    const newComplaint = {
      id: `CMP-${Math.floor(Math.random() * 10000)}`,
      ...complaintForm,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setComplaints([newComplaint, ...complaints]);
    addActivity(`Complaint Created`, `${newComplaint.id}: ${newComplaint.description} reported by ${newComplaint.citizen}`, 'System');
    showNotification('Complaint added successfully!');
    return true;
  };

  const handleUpdateComplaint = (updatedComplaint) => {
    setComplaints(complaints.map(c => c.id === updatedComplaint.id ? { ...updatedComplaint } : c));
    addActivity('Complaint Updated', `${updatedComplaint.id}: Status updated to ${updatedComplaint.status}`, 'Admin');
    showNotification('Complaint updated successfully!');
    return true;
  };

  const handleDeleteComplaint = (id) => {
    setComplaints(complaints.filter(c => c.id !== id));
    addActivity('Complaint Deleted', `${id}: Complaint removed from system`, 'Admin');
    showNotification('Complaint deleted successfully!');
  };

  // CONTRACTOR FUNCTIONS
  const handleAddContractor = (contractorForm) => {
    if (!contractorForm.name || !contractorForm.department || !contractorForm.email) {
      showNotification('Please fill all required fields', 'error');
      return false;
    }
    const newContractor = {
      id: Math.max(...contractors.map(c => c.id)) + 1,
      ...contractorForm,
      rating: parseFloat(contractorForm.rating) || 4.0,
      complaints: 0
    };
    setContractors([...contractors, newContractor]);
    addActivity('Contractor Registered', `Registered new contractor ${newContractor.name}`, 'Admin');
    showNotification('Contractor added successfully!');
    return true;
  };

  const handleUpdateContractor = (updatedContractor) => {
    setContractors(contractors.map(c => c.id === updatedContractor.id ? { ...updatedContractor } : c));
    addActivity('Contractor Updated', `Updated contractor ${updatedContractor.name} profile`, 'Admin');
    showNotification('Contractor updated successfully!');
    return true;
  };

  const handleDeleteContractor = (id) => {
    const contractor = contractors.find(c => c.id === id);
    setContractors(contractors.filter(c => c.id !== id));
    addActivity('Contractor Removed', `Removed contractor ${contractor.name} from system`, 'Admin');
    showNotification('Contractor deleted successfully!');
  };

  // ACTIVITY LOG FUNCTION
  const addActivity = (action, details, user) => {
    const newActivity = {
      id: activityLog.length + 1,
      timestamp: new Date().toLocaleString(),
      action,
      details,
      user
    };
    setActivityLog([newActivity, ...activityLog]);
  };

  // FILTERED AND SORTED DATA
  const getFilteredComplaints = (searchComplaint, filterPriority, filterStatus, sortBy) => {
    let filtered = complaints.filter(c => 
      c.id.toLowerCase().includes(searchComplaint.toLowerCase()) ||
      c.description.toLowerCase().includes(searchComplaint.toLowerCase()) ||
      c.citizen.toLowerCase().includes(searchComplaint.toLowerCase())
    );

    if (filterPriority !== 'All') filtered = filtered.filter(c => c.priority === filterPriority);
    if (filterStatus !== 'All') filtered = filtered.filter(c => c.status === filterStatus);

    if (sortBy === 'priority') {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    }

    return filtered;
  };

  const getFilteredContractors = (searchContractor) => {
    return contractors.filter(c => 
      c.name.toLowerCase().includes(searchContractor.toLowerCase()) ||
      c.department.toLowerCase().includes(searchContractor.toLowerCase()) ||
      c.city.toLowerCase().includes(searchContractor.toLowerCase())
    );
  };

  // DASHBOARD STATS
  const getDashboardStats = () => ({
    totalContractors: contractors.length,
    activeContractors: contractors.filter(c => c.status === 'Active').length,
    complaintsResolved: complaints.filter(c => c.status === 'Resolved').length,
    complaintsPending: complaints.filter(c => c.status === 'Pending').length,
    complaintsWorking: complaints.filter(c => c.status === 'Working').length,
    totalComplaints: complaints.length
  });

  const value = {
    sidebarOpen,
    setSidebarOpen,
    notification,
    setNotification,
    showNotification,
    complaints,
    role,
    contractors,
    activityLog,
    handleAddComplaint,
    handleUpdateComplaint,
    handleDeleteComplaint,
    handleAddContractor,
    handleUpdateContractor,
    handleDeleteContractor,
    getFilteredComplaints,
    getFilteredContractors,
    getDashboardStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Central export file for all API services
 * Makes imports cleaner throughout the application
 */

// Auth Service
export {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  getUserProfile as getAuthUserProfile
} from './authService';

// Complaint Service
export {
  getAllComplaints,
  getComplaintDetails,
  registerComplaint,
  updateComplaintStatus,
  assignOperator,
  escalateComplaint,
  getEscalationHistory,
  deleteComplaint
} from './complaintService';

// User Service
export {
  getAllOperators,
  createOperator,
  updateOperator,
  deleteOperator,
  getUserProfile
} from './userService';

// Activity Service
export {
  getActivityLogs
} from './activityService';

// Dashboard Service
export {
  getDashboardStats
} from './dashboardService';

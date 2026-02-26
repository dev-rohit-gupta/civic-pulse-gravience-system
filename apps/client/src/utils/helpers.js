// Helper functions for styling and utilities

export const getPriorityColor = (priority) => {
  switch(priority) {
    case 'High': return 'text-red-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

export const getPriorityBadge = (priority) => {
  switch(priority) {
    case 'High': return 'bg-red-100 text-red-700';
    case 'Medium': return 'bg-yellow-100 text-yellow-700';
    case 'Low': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'Resolved': return 'text-green-600';
    case 'Working': return 'text-blue-600';
    case 'Pending': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

export const getStatusBadge = (status) => {
  switch(status) {
    case 'Resolved': return 'bg-green-100 text-green-700';
    case 'Working': return 'bg-blue-100 text-blue-700';
    case 'Pending': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

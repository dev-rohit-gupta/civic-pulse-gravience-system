import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UpdateComplaintStatusModal = ({ complaint, onClose }) => {
  const { handleUpdateComplaint, role } = useApp();
  const [status, setStatus] = useState(complaint.status);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'assigned', label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
    { value: 'under_progress', label: 'Under Progress', color: 'bg-purple-100 text-purple-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  ];

  // Filter status options based on user role
  const getAvailableStatuses = () => {
    if (role === 'department' || role === 'admin') {
      // Department and admin can set any status - override power
      return statusOptions;
    } else if (role === 'operator') {
      // Operator can only set limited statuses
      return statusOptions.filter(opt => 
        ['assigned', 'under_progress', 'resolved'].includes(opt.value)
      );
    }
    return [];
  };

  const availableStatuses = getAvailableStatuses();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (status === complaint.status) {
      onClose();
      return;
    }

    handleUpdateComplaint({
      ...complaint,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Update Complaint Status</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {role === 'department' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Department Override:</strong> You can change the status to any value, 
                even if an operator has set it differently.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint ID
            </label>
            <input
              type="text"
              value={complaint.id}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={complaint.description}
              disabled
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Status
            </label>
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                statusOptions.find(opt => opt.value === complaint.status)?.color || 'bg-gray-100 text-gray-800'
              }`}>
                {statusOptions.find(opt => opt.value === complaint.status)?.label || complaint.status}
              </span>
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {availableStatuses.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {status !== complaint.status && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Status will change from <strong>{statusOptions.find(opt => opt.value === complaint.status)?.label}</strong> to <strong>{statusOptions.find(opt => opt.value === status)?.label}</strong>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateComplaintStatusModal;

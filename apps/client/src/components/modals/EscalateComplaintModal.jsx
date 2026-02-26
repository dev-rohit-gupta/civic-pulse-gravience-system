import React, { useState } from 'react';
import { X, AlertTriangle, ArrowUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const EscalateComplaintModal = ({ complaint, onClose }) => {
  const { handleEscalateComplaint, role } = useApp();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine escalation path based on current role
  const getEscalationPath = () => {
    if (role === 'operator') {
      return {
        from: 'Operator',
        to: 'Department',
        canEscalate: true,
        message: 'This complaint will be escalated to the Department level for further handling.',
      };
    } else if (role === 'department') {
      return {
        from: 'Department',
        to: 'Admin',
        canEscalate: true,
        message: 'This complaint will be escalated to Admin (highest level) for critical attention.',
      };
    } else if (role === 'admin') {
      return {
        from: 'Admin',
        to: 'N/A',
        canEscalate: false,
        message: 'Admin is the highest level. Cannot escalate further.',
      };
    }
    return {
      from: 'Unknown',
      to: 'Unknown',
      canEscalate: false,
      message: 'You do not have permission to escalate complaints.',
    };
  };

  const escalationPath = getEscalationPath();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (reason.trim().length < 10) {
      alert('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    setIsSubmitting(true);
    
    const success = await handleEscalateComplaint(complaint.id, reason);
    
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowUp className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Escalate Complaint</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 mb-1">Escalation Notice</p>
              <p className="text-sm text-yellow-700">{escalationPath.message}</p>
            </div>
          </div>

          {escalationPath.canEscalate && (
            <>
              <div className="grid grid-cols-2 gap-4">
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
                    Current Status
                  </label>
                  <input
                    type="text"
                    value={complaint.status}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 capitalize"
                  />
                </div>
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-600 mb-1">Current Level</p>
                    <p className="font-bold text-blue-900">{escalationPath.from}</p>
                  </div>
                  <div className="shrink-0 mx-4">
                    <ArrowUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-600 mb-1">Escalate To</p>
                    <p className="font-bold text-blue-900">{escalationPath.to}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Escalation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  placeholder="Please provide a detailed reason why this complaint needs to be escalated (minimum 10 characters)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                  minLength={10}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reason.length}/500 characters (minimum 10 required)
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Once escalated, this complaint will be reassigned to the {escalationPath.to} level. 
                  The escalation history will be tracked and visible to all authorized personnel.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting || reason.trim().length < 10}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Escalating...
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-4 h-4" />
                      Escalate to {escalationPath.to}
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {!escalationPath.canEscalate && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EscalateComplaintModal;

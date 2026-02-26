import React, { useState } from 'react';
import { Save, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AddComplaintModal = ({ onClose }) => {
  const { handleAddComplaint, operators } = useApp();
  const [complaintForm, setComplaintForm] = useState({
    description: '', 
    priority: 'Medium', 
    status: 'Pending', 
    citizen: '', 
    assignedTo: '', 
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = handleAddComplaint(complaintForm);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <input
                type="text"
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Issue description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select
                value={complaintForm.priority}
                onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={complaintForm.status}
                onChange={(e) => setComplaintForm({ ...complaintForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Working">Working</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Citizen Name *</label>
              <input
                type="text"
                value={complaintForm.citizen}
                onChange={(e) => setComplaintForm({ ...complaintForm, citizen: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Citizen name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assign To</label>
              <select
                value={complaintForm.assignedTo}
                onChange={(e) => setComplaintForm({ ...complaintForm, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select operator</option>
                {operators.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={complaintForm.dueDate}
                onChange={(e) => setComplaintForm({ ...complaintForm, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaintModal;

import React, { useState, useEffect } from 'react';
import { Save, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const EditComplaintModal = ({ complaint, onClose }) => {
  const { handleUpdateComplaint, contractors } = useApp();
  const [selectedComplaint, setSelectedComplaint] = useState(complaint);

  useEffect(() => {
    setSelectedComplaint(complaint);
  }, [complaint]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateComplaint(selectedComplaint);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={selectedComplaint.description}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={selectedComplaint.category}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Electrical">Electrical</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Parks">Parks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select
                value={selectedComplaint.priority}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, priority: e.target.value })}
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
                value={selectedComplaint.status}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Working">Working</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Citizen Name</label>
              <input
                type="text"
                value={selectedComplaint.citizen}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, citizen: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assign To</label>
              <select
                value={selectedComplaint.assignedTo}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select contractor</option>
                {contractors.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={selectedComplaint.dueDate}
                onChange={(e) => setSelectedComplaint({ ...selectedComplaint, dueDate: e.target.value })}
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
              Save
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

export default EditComplaintModal;

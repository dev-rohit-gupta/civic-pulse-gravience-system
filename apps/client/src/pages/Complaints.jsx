import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPriorityBadge, getStatusBadge } from '../utils/helpers';
import AddComplaintModal from '../components/modals/AddComplaintModal';
import EditComplaintModal from '../components/modals/EditComplaintModal';

const Complaints = () => {
  const { getFilteredComplaints, handleDeleteComplaint, activityLog } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchComplaint, setSearchComplaint] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const complaints = getFilteredComplaints(searchComplaint, filterPriority, filterStatus, sortBy);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Complaint Assignment</h1>
          <p className="text-gray-500 mt-2">Track and manage complaints</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Complaint
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchComplaint}
              onChange={(e) => setSearchComplaint(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Working">Working</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{complaint.id}</td>
                <td className="px-6 py-4 text-gray-700">{complaint.description}</td>
                <td className="px-6 py-4 text-gray-700">{complaint.category}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${getPriorityBadge(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${getStatusBadge(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{complaint.assignedTo || 'Unassigned'}</td>
                <td className="px-6 py-4 flex gap-2">
                  
                 {!complaint.assignedTo ? <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    Assign
                  </button>
                  :
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this complaint?')) {
                        handleDeleteComplaint(complaint.id);
                      }
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Re-assign
                  </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddComplaintModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && selectedComplaint && (
        <EditComplaintModal 
          complaint={selectedComplaint} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </div>
  );
};

export default Complaints;

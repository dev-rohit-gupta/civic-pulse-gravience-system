import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddDepartmentAdminModal from '../components/modals/AddDepartmentAdminModal';
import EditDepartmentAdminModal from '../components/modals/EditDepartmentAdminModal';

const DepartmentAdmins = () => {
  const { role } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentAdmins, setDepartmentAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only allow admin role to access this page
  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only system administrators can access this page.</p>
        </div>
      </div>
    );
  }

  const filteredAdmins = departmentAdmins.filter(admin => 
    admin.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.department?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Department Admins</h1>
          <p className="text-gray-500 mt-2">Manage department administrators across all departments</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Department Admin
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search department admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {filteredAdmins.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="text-6xl mb-4">👔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Department Admins Found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery 
                ? "No department admins match your search criteria."
                : "There are no department admins registered yet."}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Department Admin
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{admin.fullname}</td>
                  <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                  <td className="px-6 py-4 text-gray-700">{admin.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{admin.department?.title || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowEditModal(true);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${admin.fullname}?`)) {
                          // Handle delete
                          console.log('Delete admin:', admin._id);
                        }
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <AddDepartmentAdminModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && selectedAdmin && (
        <EditDepartmentAdminModal 
          admin={selectedAdmin} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </div>
  );
};

export default DepartmentAdmins;

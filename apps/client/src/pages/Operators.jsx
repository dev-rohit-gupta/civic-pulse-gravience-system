import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddOperatorModal from '../components/modals/AddOperatorModal';
import EditOperatorModal from '../components/modals/EditOperatorModal';

const Operators = () => {
  const { getFilteredOperators, handleDeleteOperator, role } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [searchOperator, setSearchOperator] = useState('');

  const operators = getFilteredOperators(searchOperator);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Operators</h1>
          <p className="text-gray-500 mt-2">
            {role === "admin" && "Manage all system operators"}
            {role === "department" && "Manage your department operators"}
            {role === "operator" && "View your department colleagues"}
          </p>
        </div>
        {(role === "admin" || role === "department") && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Operator
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search operators..."
              value={searchOperator}
              onChange={(e) => setSearchOperator(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {operators.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Operators Found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchOperator 
                ? "No operators match your search criteria. Try adjusting your filters."
                : "There are no operators to display at the moment."}
            </p>
            {(role === "admin" || role === "department") && !searchOperator && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Operator
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {operators.map((operator) => (
                <tr key={operator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{operator.name}</td>
                  <td className="px-6 py-4 text-gray-700">{operator.department}</td>
                  <td className="px-6 py-4 text-gray-700">{operator.city}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                      operator.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {operator.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {role === "operator" ? (
                      <button
                        onClick={() => {
                          setSelectedOperator(operator);
                          setShowEditModal(true);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOperator(operator);
                            setShowEditModal(true);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this operator?')) {
                              handleDeleteOperator(operator.id);
                            }
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <AddOperatorModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && selectedOperator && (
        <EditOperatorModal 
          operator={selectedOperator} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </div>
  );
};

export default Operators;

import React, { useState } from 'react';
import { Save, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AddOperatorModal = ({ onClose }) => {
  const { handleAddOperator } = useApp();
  const [operatorForm, setOperatorForm] = useState({
    name: '', 
    department: '', 
    status: 'Active', 
    rating: '', 
    city: '', 
    phone: '', 
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = handleAddOperator(operatorForm);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Operator</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={operatorForm.name}
              onChange={(e) => setOperatorForm({ ...operatorForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Department *</label>
            <select
              value={operatorForm.department}
              onChange={(e) => setOperatorForm({ ...operatorForm, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select department</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Electrical">Electrical</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Parks">Parks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={operatorForm.city}
              onChange={(e) => setOperatorForm({ ...operatorForm, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={operatorForm.email}
              onChange={(e) => setOperatorForm({ ...operatorForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={operatorForm.phone}
              onChange={(e) => setOperatorForm({ ...operatorForm, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10-digit phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={operatorForm.rating}
              onChange={(e) => setOperatorForm({ ...operatorForm, rating: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0-5"
            />
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

export default AddOperatorModal;

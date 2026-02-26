import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Reports = () => {
  const { complaints, contractors } = useApp();

  const reports = [
    { 
      id: 1, 
      name: 'Weekly Summary', 
      type: 'Summary', 
      totalComplaints: complaints.length, 
      resolved: complaints.filter(c => c.status === 'Resolved').length, 
      pending: complaints.filter(c => c.status === 'Pending').length 
    },
    { 
      id: 2, 
      name: 'Contractor Performance', 
      type: 'Performance', 
      data: `${contractors.length} contractors, Avg Rating: ${(contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)}` 
    },
    { 
      id: 3, 
      name: 'Category Analysis', 
      type: 'Category', 
      data: `${new Set(complaints.map(c => c.category)).size} categories, ${complaints.length} complaints` 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-2">Generate and view system analytics and reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{report.type}</p>
              </div>
            </div>
            {report.type === 'Summary' && (
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{report.totalComplaints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolved:</span>
                  <span className="font-semibold text-green-600">{report.resolved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-orange-600">{report.pending}</span>
                </div>
              </div>
            )}
            {(report.type === 'Performance' || report.type === 'Category') && (
              <p className="text-sm text-gray-700 mb-4">{report.data}</p>
            )}
            <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;

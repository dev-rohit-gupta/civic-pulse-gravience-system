import React,{useEffect} from 'react';
import { Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPriorityBadge, getStatusBadge } from '../utils/helpers';

const Dashboard = () => {

  const { complaints, activityLog, operators, getDashboardStats, role, currentUser, getFilteredActivityLog } = useApp();
  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of complaints and operator activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {role === "admin" && <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Total Operators</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOperators}</p>
              <p className="text-green-600 text-xs mt-2">✓ {stats.activeOperators} active</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>}

        {role === "department" && <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Department Operators</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOperators}</p>
              <p className="text-green-600 text-xs mt-2">✓ {stats.activeOperators} active</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>}

        {role === "citizen" && <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">My Total Complaints</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComplaints}</p>
              <p className="text-green-600 text-xs mt-2">↑ {stats.complaintsResolved} resolved</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>}

        {role === "operator" && <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Assigned to Me</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComplaints}</p>
              <p className="text-green-600 text-xs mt-2">✓ {stats.complaintsResolved} completed</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>}

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">{role === "citizen" ? "My Pending" : role === "operator" ? "My Pending" : "Pending Complaints"}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.complaintsPending}</p>
              <p className="text-orange-600 text-xs mt-2">Awaiting action</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">{role === "citizen" ? "My In Progress" : role === "operator" ? "Working On" : "In Progress"}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.complaintsWorking}</p>
              <p className="text-blue-600 text-xs mt-2">Being worked on</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">{role === "citizen" ? "My Resolved" : role === "operator" ? "Completed" : "Resolved"}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.complaintsResolved}</p>
              <p className="text-green-600 text-xs mt-2">{role === "operator" ? "Great work!" : "Completion rate"}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

  
      </div>

      <div className="flex flex-col gap-6 grow">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Complaints</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Priority</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4 font-semibold text-gray-900">{complaint.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{complaint.description}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       {role !== "citizen" && <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {role === "operator" ? "My Recent Activity" : "Recent Activity"}
          </h2>
          <div className="space-y-3">
            {getFilteredActivityLog().slice(0, 5).map((activity) => (
              <div key={activity.id} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {activity.user.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default Dashboard;

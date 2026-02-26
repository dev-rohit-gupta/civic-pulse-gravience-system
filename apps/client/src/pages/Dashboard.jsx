import React,{useEffect} from 'react';
import { Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPriorityBadge, getStatusBadge } from '../utils/helpers';

const Dashboard = () => {

  const { complaints, activityLog, operators, getDashboardStats , role} = useApp();
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

       { role === "citizen" && <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComplaints}</p>
              <p className="text-green-600 text-xs mt-2">↑ {stats.complaintsResolved} resolved</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>}

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Pending Complaints</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.complaintsPending}</p>
              <p className="text-orange-600 text-xs mt-2">Awaiting action</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.complaintsWorking}</p>
              <p className="text-blue-600 text-xs mt-2">Being worked on</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Resolved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.complaintsResolved}</p>
              <p className="text-green-600 text-xs mt-2">Completion rate</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

  
      </div>

      <div className="flex flex-col gap-6 grow">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Complaints</h2>
          <div className="space-y-3">
            {complaints.slice(0, 5).map((complaint) => (
              <div key={complaint.id} className="flex items-start justify-between  p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center justify-between grow">
                  <span className="font-semibold text-gray-900">{complaint.id}</span>
                  <span className="text-sm text-gray-600">{complaint.description}</span>
                  <div className="flex gap-2 end-safe items-center justify-center">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       {role != "citizen" && <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map((activity) => (
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

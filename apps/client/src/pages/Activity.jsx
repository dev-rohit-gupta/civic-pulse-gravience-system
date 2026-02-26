import React from 'react';
import { Download, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Activity = () => {
  const { activityLog } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500 mt-2">View all system and user activities</p>
        </div>
        {/* <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button> */}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {activityLog.map((entry) => (
            <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.action}</h3>
                      <p className="text-gray-700 mt-1">{entry.details}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {entry.user}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{entry.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity;

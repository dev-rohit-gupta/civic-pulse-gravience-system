import React from 'react';
import { useApp } from '../context/AppContext'; 

const Profile = () => {
  const { role } = useApp();
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
              DA
            </div>
            {role === 'department_admin' && <h2 className="text-2xl font-bold text-gray-900">Department Admin</h2>}
            {role === 'citizen' && <h2 className="text-2xl font-bold text-gray-900">Citizen</h2>}
            {role === 'contractor' && <h2 className="text-2xl font-bold text-gray-900">Operators</h2>}
            {role === 'admin' && <h2 className="text-2xl font-bold text-gray-900">System Admin</h2>}
            {role === 'admin' && <p className="text-gray-600 mt-1">Admin User</p>}
            {role === 'citizen' && <p className="text-gray-600 mt-1">Citizen</p>}
            {role === 'contractor' && <p className="text-gray-600 mt-1">Operator</p>}
            {role === 'department' && <p className="text-gray-600 mt-1">Department</p>}
            {role === 'department' && <p className="text-gray-500 text-sm mt-4">Public Works Department</p>}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" value="admin@civicpulse.gov.in" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                <input type="text" value="Public Works" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Member Since</label>
                <input type="text" value="January 15, 2025" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">SMS alerts for high priority</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Weekly digest report</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

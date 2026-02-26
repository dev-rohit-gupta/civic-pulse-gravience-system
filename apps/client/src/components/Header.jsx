import React, { use } from 'react';
import { useApp } from '../context/AppContext';
const Header = () => {
  const { role } = useApp();
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div></div>
      <div className="flex items-center gap-4">
        {role === "department" && <span className="text-sm text-gray-600">Department Admin</span>}
        {role === "citizen" && <span className="text-sm text-gray-600">Citizen</span>}
        {role === "operator" && <span className="text-sm text-gray-600">Operator</span>}
        {role === "admin" && <span className="text-sm text-gray-600">System Admin</span>}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          DA
        </div>
      </div>
    </div>
  );
};

export default Header;

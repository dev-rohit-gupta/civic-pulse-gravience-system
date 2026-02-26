import React from 'react';
import { Outlet } from 'react-router';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default PublicLayout;

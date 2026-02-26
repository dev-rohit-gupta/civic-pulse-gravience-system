import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Notification from '../components/Notification';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <Outlet />
          </div>
        </div>
      </div>

      <Notification />
    </div>
  );
};

export default MainLayout;

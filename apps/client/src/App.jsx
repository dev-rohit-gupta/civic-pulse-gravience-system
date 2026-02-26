import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import Dashboard from './pages/Dashboard';
import Contractors from './pages/Contractors';
import Complaints from './pages/Complaints';
import Activity from './pages/Activity';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import CivicPulsePortal from './pages/CivicPulsePortal';

const CivicPulseApp = () => {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public Layout Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/civic-pulse-portal" element={<CivicPulsePortal />} />
        </Route>

        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default CivicPulseApp;

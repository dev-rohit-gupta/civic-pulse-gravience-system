import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Departments from './pages/Departments';
import DepartmentAdmins from './pages/DepartmentAdmins';
import Operators from './pages/Operators';
import Complaints from './pages/Complaints';
import Activity from './pages/Activity';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import CivicPulsePortal from './pages/CivicPulsePortal';
import Login from './pages/login';
import AdminRegister from './pages/AdminRegister';

const CivicPulseApp = () => {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        
        {/* Public Layout Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/civic-pulse-portal" replace />} />
          <Route path="/civic-pulse-portal" element={<CivicPulsePortal />} />
        </Route>

        {/* Protected Main Layout Routes */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/department-admins" element={<DepartmentAdmins />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/operators" element={<Operators />} />
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

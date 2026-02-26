import React from 'react';
import { useApp } from '../context/AppContext';

const Notification = () => {
  const { notification } = useApp();
  
  if (!notification) return null;
  
  return (
    <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 animate-pulse ${
      notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {notification.message}
    </div>
  );
};

export default Notification;

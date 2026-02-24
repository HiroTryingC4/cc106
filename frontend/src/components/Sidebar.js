import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-50 text-primary border-l-4 border-primary' : 'text-gray-700 hover:bg-gray-50';
  };

  const getMenuItems = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/verifications', label: 'Host Verifications', icon: '✅' },
        { path: '/admin/units', label: 'Units', icon: '🏠' },
        { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
        { path: '/admin/financial', label: 'Financial', icon: '💰' },
        { path: '/admin/reports', label: 'Reports', icon: '📈' },
        { path: '/admin/logs', label: 'Activity Logs', icon: '📝' },
        { path: '/admin/security', label: 'Security', icon: '🔒' },
        { path: '/admin/chatbot', label: 'Chatbot', icon: '🤖' },
        { path: '/admin/chatbot-analytics', label: 'Chatbot Analytics', icon: '📊' },
        { path: '/admin/messages', label: 'Messages', icon: '💬' },
        { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/admin/system', label: 'System', icon: '⚙️' },
      ];
    }

    if (user.role === 'host') {
      return [
        { path: '/host/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/host/verification', label: user.verified ? 'Verified ✓' : 'Get Verified', icon: '✅' },
        { path: '/host/units', label: 'My Units', icon: '🏠' },
        { path: '/host/bookings', label: 'Bookings', icon: '📅' },
        { path: '/host/analytics', label: 'Analytics', icon: '📈' },
        { path: '/host/financial-management', label: 'Financial', icon: '💰' },
        { path: '/host/reports', label: 'Reports', icon: '📋' },
        { path: '/host/guests', label: 'Guests', icon: '👥' },
        { path: '/host/messages', label: 'Messages', icon: '💬' },
        { path: '/host/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/host/chatbot', label: 'AI Chatbot', icon: '🤖' },
      ];
    }

    if (user.role === 'guest') {
      return [
        { path: '/guest/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/guest/recommendations', label: 'Recommendations', icon: '✨' },
        { path: '/guest/bookings', label: 'My Bookings', icon: '📅' },
        { path: '/guest/messages', label: 'Messages', icon: '💬' },
        { path: '/guest/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/guest/profile', label: 'Profile', icon: '👤' },
        { path: '/units', label: 'Browse Units', icon: '🔍' },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {user?.role} Panel
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {user?.firstName}
          </p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${isActive(item.path)}`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

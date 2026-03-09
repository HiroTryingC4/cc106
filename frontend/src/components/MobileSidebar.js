import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Close sidebar when route changes (but not on initial mount)
  const isInitialMount = React.useRef(true);
  const prevPathname = React.useRef(location.pathname);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathname.current = location.pathname;
      return;
    }
    
    // Only close if pathname actually changed
    if (prevPathname.current !== location.pathname && isOpen) {
      onClose();
      prevPathname.current = location.pathname;
    }
  }, [location.pathname, isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const isActive = (path) => {
    if (user?.role === 'guest' || user?.role === 'host') {
      return location.pathname === path ? 'bg-white text-[#4E7B22] font-semibold' : 'text-white hover:bg-[#3d6219]';
    }
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
        { path: '/admin/promo-codes', label: 'Promo Codes', icon: '🎫' },
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
        { path: '/host/verification', label: 'Verification', icon: '✅' },
        { path: '/host/units', label: 'My Units', icon: '🏠' },
        { path: '/host/bookings', label: 'Booking', icon: '📖' },
        { path: '/host/promo-codes', label: 'Promo Codes', icon: '🎫' },
        { path: '/host/payments', label: 'Payments', icon: '💳' },
        { path: '/host/financial', label: 'Financial', icon: '💰' },
        { path: '/host/messages', label: 'Messages', icon: '💬' },
        { path: '/host/reports', label: 'Reports', icon: '📊' },
        { path: '/host/profile', label: 'Settings', icon: '⚙️' },
      ];
    }

    if (user.role === 'guest') {
      return [
        { path: '/guest/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/guest/units', label: 'Units', icon: '🏠' },
        { path: '/guest/recommendations', label: 'Recommendations', icon: '📖' },
        { path: '/guest/bookings', label: 'My Bookings', icon: '📅' },
        { path: '/guest/messages', label: 'Messages', icon: '💬' },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const sidebarBgClass = (user?.role === 'guest' || user?.role === 'host') ? 'bg-[#4E7B22]' : 'bg-white';
  const headerTextClass = (user?.role === 'guest' || user?.role === 'host') ? 'text-white' : 'text-gray-800';
  const subTextClass = (user?.role === 'guest' || user?.role === 'host') ? 'text-green-100' : 'text-gray-600';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 ${sidebarBgClass} shadow-xl z-50 lg:hidden flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header with close button */}
        <div className="p-4 flex items-center justify-between border-b border-white border-opacity-20">
          <div>
            <h2 className={`text-xl font-bold ${headerTextClass} capitalize`}>
              {user?.role} Panel
            </h2>
            <p className={`text-sm ${subTextClass} mt-1`}>
              Welcome, {user?.firstName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition min-h-[44px] ${isActive(
                  item.path
                )}`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Section at Bottom */}
        <div className="p-4 border-t border-white border-opacity-20">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full bg-[#D4A574] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-green-100 text-xs truncate">{user?.email}</p>
            </div>

            {/* Logout Icon */}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }
              }}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Logout"
              aria-label="Logout"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;

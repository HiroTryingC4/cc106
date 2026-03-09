import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/reports/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const iconMap = {
      'booking_created': { icon: '📅', bg: 'bg-blue-100', color: 'text-blue-600' },
      'booking_cancelled': { icon: '❌', bg: 'bg-red-100', color: 'text-red-600' },
      'booking_completed': { icon: '✅', bg: 'bg-green-100', color: 'text-green-600' },
      'booking_approved': { icon: '✓', bg: 'bg-green-100', color: 'text-green-600' },
      'unit_created': { icon: '🏠', bg: 'bg-green-100', color: 'text-green-600' },
      'unit_updated': { icon: '✏️', bg: 'bg-blue-100', color: 'text-blue-600' },
      'unit_deleted': { icon: '🗑️', bg: 'bg-red-100', color: 'text-red-600' },
      'user_created': { icon: '👤', bg: 'bg-green-100', color: 'text-green-600' },
      'user_updated': { icon: '✏️', bg: 'bg-blue-100', color: 'text-blue-600' },
      'user_deactivated': { icon: '🚫', bg: 'bg-red-100', color: 'text-red-600' },
      'review_created': { icon: '⭐', bg: 'bg-yellow-100', color: 'text-yellow-600' },
      'review_submitted': { icon: '�', bg: 'bg-green-100', color: 'text-green-600' },
      'review_deleted': { icon: '🗑️', bg: 'bg-red-100', color: 'text-red-600' },
      'payment_completed': { icon: '�', bg: 'bg-green-100', color: 'text-green-600' },
      'login': { icon: '🔐', bg: 'bg-blue-100', color: 'text-blue-600' },
      'logout': { icon: '🚪', bg: 'bg-gray-100', color: 'text-gray-600' }
    };
    return iconMap[action] || { icon: '📝', bg: 'bg-gray-100', color: 'text-gray-600' };
  };

  const formatActionTitle = (action) => {
    return action.replace(/_/g, ' ').toUpperCase();
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.action.includes(filter);
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-2">System activity and audit trail</p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('booking')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'booking'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => setFilter('unit')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'unit'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Units
        </button>
        <button
          onClick={() => setFilter('user')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'user'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setFilter('payment')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'payment'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setFilter('review')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'review'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reviews
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            filteredLogs.map(log => {
              const iconData = getActionIcon(log.action);
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${iconData.bg} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                    {iconData.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`font-semibold text-sm ${iconData.color}`}>
                        {formatActionTitle(log.action)}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{log.details}</p>
                    {log.userId && (
                      <p className="text-xs text-gray-500">User ID: {log.userId}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {filteredLogs.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </AdminLayout>
  );
};

export default Logs;


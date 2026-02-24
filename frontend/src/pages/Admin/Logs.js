import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

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
    switch (action) {
      case 'booking_created': return '📅';
      case 'booking_cancelled': return '❌';
      case 'booking_completed': return '✅';
      case 'unit_created': return '🏠';
      case 'unit_updated': return '✏️';
      case 'unit_deleted': return '🗑️';
      case 'user_created': return '👤';
      case 'user_updated': return '✏️';
      case 'user_deactivated': return '🚫';
      case 'review_created': return '⭐';
      case 'review_deleted': return '🗑️';
      case 'payment_completed': return '💰';
      case 'login': return '🔐';
      case 'logout': return '🚪';
      default: return '📝';
    }
  };

  const getActionColor = (action) => {
    if (action.includes('created')) return 'text-green-600';
    if (action.includes('deleted') || action.includes('cancelled')) return 'text-red-600';
    if (action.includes('updated')) return 'text-blue-600';
    if (action.includes('completed')) return 'text-green-600';
    return 'text-gray-600';
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.action.includes(filter);
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-2">System activity and audit trail</p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'booking' ? 'primary' : 'secondary'}
          onClick={() => setFilter('booking')}
          size="sm"
        >
          Bookings
        </Button>
        <Button
          variant={filter === 'unit' ? 'primary' : 'secondary'}
          onClick={() => setFilter('unit')}
          size="sm"
        >
          Units
        </Button>
        <Button
          variant={filter === 'user' ? 'primary' : 'secondary'}
          onClick={() => setFilter('user')}
          size="sm"
        >
          Users
        </Button>
        <Button
          variant={filter === 'payment' ? 'primary' : 'secondary'}
          onClick={() => setFilter('payment')}
          size="sm"
        >
          Payments
        </Button>
        <Button
          variant={filter === 'review' ? 'primary' : 'secondary'}
          onClick={() => setFilter('review')}
          size="sm"
        >
          Reviews
        </Button>
      </div>

      <Card>
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="text-3xl">{getActionIcon(log.action)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{log.details}</p>
                  {log.userId && (
                    <p className="text-xs text-gray-500 mt-1">User ID: {log.userId}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {filteredLogs.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </DashboardLayout>
  );
};

export default Logs;

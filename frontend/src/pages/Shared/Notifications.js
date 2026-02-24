import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/${user.role}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Generate sample notifications if endpoint doesn't exist
      generateSampleNotifications();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleNotifications = () => {
    const sampleNotifications = [];
    
    if (user.role === 'guest') {
      sampleNotifications.push(
        {
          id: '1',
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your booking for Luxury Beachfront Condo has been confirmed',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Successful',
          message: 'Your payment of ₱750 has been processed',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: '3',
          type: 'message',
          title: 'New Message',
          message: 'Host replied to your inquiry',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          read: false
        }
      );
    } else if (user.role === 'host') {
      sampleNotifications.push(
        {
          id: '1',
          type: 'booking',
          title: 'New Booking Request',
          message: 'You have a new booking request for Modern Downtown Studio',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of ₱1,320 received for booking #2',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: '3',
          type: 'review',
          title: 'New Review',
          message: 'Guest left a 5-star review for your property',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          read: false
        }
      );
    } else if (user.role === 'admin') {
      sampleNotifications.push(
        {
          id: '1',
          type: 'security',
          title: 'Security Alert',
          message: 'Multiple failed login attempts detected',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'system',
          title: 'System Update',
          message: 'System backup completed successfully',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: '3',
          type: 'report',
          title: 'Content Flagged',
          message: 'A review has been flagged for moderation',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          read: false
        }
      );
    }
    
    setNotifications(sampleNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking': return '📅';
      case 'payment': return '💰';
      case 'message': return '💬';
      case 'review': return '⭐';
      case 'security': return '🔒';
      case 'system': return '⚙️';
      case 'report': return '🚩';
      default: return '🔔';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap items-center">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'primary' : 'secondary'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'primary' : 'secondary'}
          onClick={() => setFilter('read')}
          size="sm"
        >
          Read ({notifications.length - unreadCount})
        </Button>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            onClick={markAllAsRead}
            size="sm"
            className="ml-auto"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications found</p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`${!notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  <div className="flex gap-2 mt-3">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
          <p className="text-xs text-gray-500 mt-1">All registered users</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Total Hosts</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalHosts || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Property owners</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Total Units</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.totalUnits || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Listed properties</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₱{stats?.totalRevenue || 0}</p>
          <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold">{stats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Bookings</span>
              <span className="font-semibold text-yellow-600">{stats?.pendingBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Guests</span>
              <span className="font-semibold">{stats?.totalGuests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System Status</span>
              <span className="text-green-600 font-semibold">● Healthy</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/users">
              <Button className="w-full" variant="secondary">
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/units">
              <Button className="w-full" variant="secondary">
                Manage Units
              </Button>
            </Link>
            <Link to="/admin/reviews">
              <Button className="w-full" variant="secondary">
                Moderate Reviews
              </Button>
            </Link>
            <Link to="/admin/financial">
              <Button className="w-full" variant="secondary">
                View Financial Reports
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button className="w-full" variant="secondary">
                Generate Reports
              </Button>
            </Link>
            <Link to="/admin/logs">
              <Button className="w-full" variant="secondary">
                Activity Logs
              </Button>
            </Link>
            <Link to="/admin/chatbot">
              <Button className="w-full" variant="secondary">
                Manage Chatbot
              </Button>
            </Link>
            <Link to="/admin/chatbot-analytics">
              <Button className="w-full" variant="secondary">
                Chatbot Analytics
              </Button>
            </Link>
            <Link to="/admin/security">
              <Button className="w-full" variant="secondary">
                Security & Fraud
              </Button>
            </Link>
            <Link to="/admin/system">
              <Button className="w-full" variant="secondary">
                System Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
